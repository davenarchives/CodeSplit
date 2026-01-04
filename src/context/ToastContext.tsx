import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import Toast from "../components/Toast/Toast";

interface ToastContextType {
    showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [message, setMessage] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    const showToast = useCallback((msg: string) => {
        setMessage(msg);
        setIsVisible(true);
    }, []);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setMessage("");
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toast message={message} isVisible={isVisible} onClose={handleClose} />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
