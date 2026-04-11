'use client'

import { Toast } from "@/components/Toast";
import { FileX } from "lucide-react";
import { createContext, ReactNode, useContext, useState } from "react";


type ToastType = "success" | "error" | "warning" | "informational";


interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null)

export const ToasTProvider = ({children}: {children: ReactNode}) => {
    const [toast, setToast] = useState<{
        message: string;
        type: ToastType;
    } | null>(null);

    const showToast = (message: string, type: ToastType = 'success') => {
        setToast({message, type})

        setTimeout(() => {
            setToast(null);
        }, 5000);
    };

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}

            {toast && (
                <div style={{
                    position: "absolute",
                    top: 30,
                    left: 0, 
                    right: 0,
                    // backgroundColor: 'red',
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 999,
                }}>
                    <div style={{ maxWidth: "100%" }}>
                        
                    <Toast message={toast?.message} type={toast?.type} />
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    )
}


export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
