import {
    ref,
    set,
    push,
    get,
    remove,
    update,
    query,
    orderByChild,
    equalTo,
    serverTimestamp
} from "firebase/database";
import { database } from "../config/firebase";
import { officialTemplates } from "../data/templates";

// Type definitions
export interface ProjectData {
    title: string;
    html: string;
    css: string;
    js: string;
}

export interface Project extends ProjectData {
    id: string;
    ownerId: string;
    updatedAt: number; // Realtime DB timestamps are numbers (milliseconds)
    isPublic?: boolean; // Whether the project is publicly visible
    isFeatured?: boolean; // Whether the project is featured on user's profile
    // Community publishing fields
    description?: string;
    tags?: string[];
    likes?: number;
    views?: number;
    publishedAt?: number;
}

export interface SaveProjectInput extends ProjectData {
    id?: string; // Optional - if provided, update existing project
}

const PROJECTS_PATH = "projects";

/**
 * Saves a project to either LocalStorage or Firebase Realtime Database.
 * If project.id starts with "local-", saves to localStorage.
 * Otherwise, saves to Firebase.
 * 
 * @param userId - The ID of the user who owns the project (ignored for local projects)
 * @param projectData - The project data to save
 * @returns The ID of the saved project
 */
export const saveProject = async (
    userId: string,
    projectData: SaveProjectInput
): Promise<string> => {
    const { id, title, html, css, js } = projectData;

    // Check if this is a local project
    if (id && id.startsWith("local-")) {
        // Save to localStorage
        const project: Project = {
            id,
            title,
            html,
            css,
            js,
            ownerId: "local",
            updatedAt: Date.now()
        };
        localStorage.setItem(`project-${id}`, JSON.stringify(project));
        return id;
    }

    // Cloud storage logic
    if (id) {
        // Update existing project - use update() to preserve other fields (isPublic, tags, likes, etc.)
        const projectRef = ref(database, `${PROJECTS_PATH}/${id}`);
        await update(projectRef, {
            title,
            html,
            css,
            js,
            updatedAt: serverTimestamp()
        });
        return id;
    } else {
        // Create new project - use set() with full data including ownerId
        const projectsRef = ref(database, PROJECTS_PATH);
        const newProjectRef = push(projectsRef);
        await set(newProjectRef, {
            title,
            html,
            css,
            js,
            ownerId: userId,
            updatedAt: serverTimestamp()
        });
        return newProjectRef.key!;
    }
};

/**
 * Retrieves all projects for a specific user from both localStorage and Firebase.
 * 
 * @param userId - The ID of the user whose projects to fetch (ignored for local projects)
 * @returns A combined array of local and cloud projects owned by the user
 */
export const getUserProjects = async (userId: string): Promise<Project[]> => {
    const cloudProjects: Project[] = [];
    const localProjects: Project[] = [];

    // Fetch cloud projects from Firebase
    if (userId) {
        const projectsRef = ref(database, PROJECTS_PATH);
        const q = query(
            projectsRef,
            orderByChild("ownerId"),
            equalTo(userId)
        );

        const snapshot = await get(q);

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                cloudProjects.push({
                    id: childSnapshot.key!,
                    title: data.title,
                    html: data.html,
                    css: data.css,
                    js: data.js,
                    ownerId: data.ownerId,
                    updatedAt: data.updatedAt,
                    isPublic: data.isPublic ?? false,
                    isFeatured: data.isFeatured ?? false
                });
            });
        }
    }

    // Fetch local projects from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("project-local-")) {
            try {
                const projectData = localStorage.getItem(key);
                if (projectData) {
                    const project: Project = JSON.parse(projectData);
                    localProjects.push(project);
                }
            } catch (error) {
                console.error(`Error parsing local project ${key}:`, error);
            }
        }
    }

    // Combine and sort by updatedAt descending
    const allProjects = [...cloudProjects, ...localProjects];
    return allProjects.sort((a, b) => b.updatedAt - a.updatedAt);
};

/**
 * Retrieves a single project by ID from either localStorage or Firebase.
 * If ID starts with "local-", fetches from localStorage.
 * Otherwise, fetches from Firebase.
 * 
 * @param projectId - The ID of the project to fetch
 * @returns The project data or null if not found
 */
export const getProjectById = async (projectId: string): Promise<Project | null> => {
    // Check if this is a local project
    if (projectId.startsWith("local-")) {
        // Fetch from localStorage
        try {
            const projectData = localStorage.getItem(`project-${projectId}`);
            if (projectData) {
                return JSON.parse(projectData);
            }
        } catch (error) {
            console.error(`Error parsing local project ${projectId}:`, error);
        }
        return null;
    }

    // Fetch from Firebase
    const projectRef = ref(database, `${PROJECTS_PATH}/${projectId}`);
    const snapshot = await get(projectRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        return {
            id: projectId,
            title: data.title,
            html: data.html,
            css: data.css,
            js: data.js,
            ownerId: data.ownerId,
            updatedAt: data.updatedAt,
            isPublic: data.isPublic ?? false,
            isFeatured: data.isFeatured ?? false,
            description: data.description || "",
            tags: data.tags || []
        };
    }

    return null;
};

/**
 * Deletes a project from either localStorage or Firebase Realtime Database.
 * 
 * @param projectId - The ID of the project to delete
 */
export const deleteProject = async (projectId: string): Promise<void> => {
    // Check if this is a local project
    if (projectId.startsWith("local-")) {
        localStorage.removeItem(`project-${projectId}`);
        return;
    }

    // Delete from Firebase
    const projectRef = ref(database, `${PROJECTS_PATH}/${projectId}`);
    await remove(projectRef);
};

/**
 * Renames a project by updating only the title field.
 * 
 * @param projectId - The ID of the project to rename
 * @param newTitle - The new title for the project
 */
export const renameProject = async (projectId: string, newTitle: string): Promise<void> => {
    // Check if this is a local project
    if (projectId.startsWith("local-")) {
        const projectData = localStorage.getItem(`project-${projectId}`);
        if (projectData) {
            const project = JSON.parse(projectData);
            project.title = newTitle;
            project.updatedAt = Date.now();
            localStorage.setItem(`project-${projectId}`, JSON.stringify(project));
        }
        return;
    }

    // Update in Firebase
    const projectRef = ref(database, `${PROJECTS_PATH}/${projectId}`);
    await update(projectRef, {
        title: newTitle,
        updatedAt: serverTimestamp()
    });
};

/**
 * Duplicates an existing project with a new ID and "Copy of" prefix.
 * 
 * @param userId - The ID of the user who owns the project
 * @param originalProject - The project to duplicate
 * @returns The ID of the new duplicated project
 */
export const duplicateProject = async (
    userId: string,
    originalProject: Project
): Promise<string> => {
    const newTitle = `Copy of ${originalProject.title || "Untitled Project"}`;

    // Check if this is a local project
    if (originalProject.id.startsWith("local-")) {
        // Create a new local project
        const newId = `local-${Date.now()}`;
        const newProject: Project = {
            id: newId,
            title: newTitle,
            html: originalProject.html,
            css: originalProject.css,
            js: originalProject.js,
            ownerId: "local",
            updatedAt: Date.now()
        };
        localStorage.setItem(`project-${newId}`, JSON.stringify(newProject));
        return newId;
    }

    // Duplicate in Firebase
    const projectsRef = ref(database, PROJECTS_PATH);
    const newProjectRef = push(projectsRef);

    await set(newProjectRef, {
        title: newTitle,
        html: originalProject.html,
        css: originalProject.css,
        js: originalProject.js,
        ownerId: userId,
        updatedAt: serverTimestamp()
    });

    return newProjectRef.key!;
};

/**
 * Forks a template to create a new project for the user.
 * 
 * @param templateId - The ID of the template to fork
 * @param userId - The ID of the user who will own the new project
 * @returns The ID of the newly created project
 * @throws Error if template is not found
 */
export const forkTemplate = async (
    templateId: string,
    userId: string
): Promise<string> => {
    // Find the template by ID
    const template = officialTemplates.find(t => t.id === templateId);

    if (!template) {
        throw new Error(`Template with ID "${templateId}" not found`);
    }

    // Create a new project from the template
    const projectsRef = ref(database, PROJECTS_PATH);
    const newProjectRef = push(projectsRef);

    await set(newProjectRef, {
        title: template.title,
        html: template.html,
        css: template.css,
        js: template.js,
        ownerId: userId,
        updatedAt: serverTimestamp()
    });

    return newProjectRef.key!;
};

/**
 * Toggles the public visibility of a project.
 * 
 * @param projectId - The ID of the project
 * @param isPublic - Whether the project should be publicly visible
 */
export const toggleProjectVisibility = async (
    projectId: string,
    isPublic: boolean
): Promise<void> => {
    const projectRef = ref(database, `${PROJECTS_PATH}/${projectId}`);
    await update(projectRef, {
        isPublic,
        updatedAt: serverTimestamp()
    });
};

/**
 * Toggles the featured status of a project.
 * 
 * @param projectId - The ID of the project
 * @param isFeatured - Whether the project should be featured on user's profile
 */
export const toggleProjectFeatured = async (
    projectId: string,
    isFeatured: boolean
): Promise<void> => {
    const projectRef = ref(database, `${PROJECTS_PATH}/${projectId}`);
    await update(projectRef, {
        isFeatured,
        updatedAt: serverTimestamp()
    });
};

/**
 * Retrieves all featured projects for a specific user.
 * 
 * @param userId - The ID of the user whose featured projects to fetch
 * @returns An array of featured projects owned by the user
 */
export const getFeaturedProjects = async (userId: string): Promise<Project[]> => {
    const projectsRef = ref(database, PROJECTS_PATH);
    const q = query(
        projectsRef,
        orderByChild("ownerId"),
        equalTo(userId)
    );

    const snapshot = await get(q);
    const projects: Project[] = [];

    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            // Only include projects that are featured
            if (data.isFeatured) {
                projects.push({
                    id: childSnapshot.key!,
                    title: data.title,
                    html: data.html,
                    css: data.css,
                    js: data.js,
                    ownerId: data.ownerId,
                    updatedAt: data.updatedAt,
                    isPublic: data.isPublic ?? false,
                    isFeatured: true
                });
            }
        });
    }

    // Sort by updatedAt descending
    return projects.sort((a, b) => b.updatedAt - a.updatedAt);
};
