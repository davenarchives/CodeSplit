import { useState, useCallback, useEffect } from "react";

/**
 * Hook for managing resizable split panes.
 * @param initialWidth - Initial width percentage (default: 50)
 * @param minWidth - Minimum width percentage (default: 20)
 * @param maxWidth - Maximum width percentage (default: 80)
 */
export function useResizable(
    initialWidth: number = 50,
    minWidth: number = 20,
    maxWidth: number = 80
) {
    const [width, setWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback(
        (event: MouseEvent) => {
            if (isResizing) {
                const newWidth = (event.clientX / window.innerWidth) * 100;
                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    setWidth(newWidth);
                }
            }
        },
        [isResizing, minWidth, maxWidth]
    );

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResizing);
        }

        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    return { width, startResizing, isResizing };
}
