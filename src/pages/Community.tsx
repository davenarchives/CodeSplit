import { ExternalLink, Github, Heart, Users, Sparkles } from "lucide-react";

const COMMUNITY_LINKS = [
    {
        title: "GitHub Repository",
        description: "Star the project, report issues, or contribute code",
        icon: Github,
        href: "https://github.com/CyberSphinxxx/Interactive_Code_Editor",
        color: "from-slate-600 to-slate-800",
    },
    {
        title: "Discussions",
        description: "Join the community discussion, ask questions, share ideas",
        icon: Users,
        href: "https://github.com/CyberSphinxxx/Interactive_Code_Editor/discussions",
        color: "from-blue-600 to-blue-800",
    },
];

const FEATURED_TEMPLATES = [
    {
        title: "Landing Page",
        description: "A modern, responsive landing page template",
        tags: ["HTML", "CSS", "Responsive"],
    },
    {
        title: "Dashboard UI",
        description: "Admin dashboard with charts and tables",
        tags: ["HTML", "CSS", "JavaScript"],
    },
    {
        title: "Portfolio",
        description: "Personal portfolio with smooth animations",
        tags: ["HTML", "CSS", "Animation"],
    },
    {
        title: "Blog Layout",
        description: "Clean blog layout with typography focus",
        tags: ["HTML", "CSS", "Typography"],
    },
];

function Community() {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Community</h1>
                <p className="text-slate-400">
                    Connect with other developers and explore templates
                </p>
            </div>

            {/* Community Links */}
            <div className="mb-10">
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Connect</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {COMMUNITY_LINKS.map((link) => (
                        <a
                            key={link.title}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-slate-800/50 rounded-xl border border-slate-700 p-5 hover:border-slate-600 hover:bg-slate-800 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${link.color}`}>
                                    <link.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                            {link.title}
                                        </h3>
                                        <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <p className="text-sm text-slate-400 mt-1">{link.description}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Featured Templates */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Featured Templates</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FEATURED_TEMPLATES.map((template) => (
                        <div
                            key={template.title}
                            className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 hover:border-slate-600 hover:bg-slate-800 transition-all cursor-pointer group"
                        >
                            {/* Template Preview Placeholder */}
                            <div className="h-32 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 mb-4 flex items-center justify-center">
                                <span className="text-slate-500 text-sm">Preview</span>
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                                {template.title}
                            </h3>
                            <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                            <div className="flex flex-wrap gap-2">
                                {template.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-slate-500 text-sm mt-4">
                    More templates coming soon!
                </p>
            </div>

            {/* Support Section */}
            <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-xl border border-pink-500/20 p-6 text-center">
                <Heart className="w-8 h-8 text-pink-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Support CodeSplit</h3>
                <p className="text-slate-400 text-sm mb-4">
                    If you enjoy using CodeSplit, consider starring the repo on GitHub!
                </p>
                <a
                    href="https://github.com/CyberSphinxxx/Interactive_Code_Editor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                    <Github className="w-4 h-4" />
                    Star on GitHub
                </a>
            </div>
        </div>
    );
}

export default Community;
