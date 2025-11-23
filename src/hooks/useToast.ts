import { ToastContext } from "../context/ToastContext";
import { useContext } from "react";

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};