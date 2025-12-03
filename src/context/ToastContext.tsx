/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextProps {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const success = (msg: string) => showToast(msg, "success");
  const error = (msg: string) => showToast(msg, "error");
  const info = (msg: string) => showToast(msg, "info");

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-lg">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`
                mb-3 px-4 py-3 rounded-xl flex items-center gap-3 shadow-xl 
                border backdrop-blur-md text-sm font-medium
                ${
                  toast.type === "success"
                    ? "bg-green-700/50 text-green-100 border-green-500/40"
                    : toast.type === "error"
                    ? "bg-red-700/50 text-red-100 border-red-500/40"
                    : "bg-blue-700/50 text-blue-100 border-blue-500/40"
                }
              `}
            >
              {/* Icon */}
              {toast.type === "success" && (
                <CheckCircle size={20} className="text-green-300" />
              )}
              {toast.type === "error" && (
                <AlertTriangle size={20} className="text-red-300" />
              )}
              {toast.type === "info" && (
                <Info size={20} className="text-blue-300" />
              )}

              {/* Message */}
              <span className="text-xs md:text-sm">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
