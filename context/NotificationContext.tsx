'use client'

import { createContext, ReactNode, useContext, useState } from "react";



interface ContextProps {
    isOpen: boolean;
    setIsOpen: any;
}

export const NotificationContext = createContext<ContextProps | null>(null)



export const NotificationProvider = ({children}: {children:ReactNode}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <NotificationContext.Provider value={{
            isOpen,
            setIsOpen
        }}>
            {children}
        </NotificationContext.Provider>
    )
}


export const useNotify = () => {
    const context = useContext(NotificationContext);
    
      if (!context) {
        throw new Error("useNotify must be used within a NotificationProvider");
      }
    
      return context;
}
