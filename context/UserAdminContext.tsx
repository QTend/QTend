'use client'

import { createContext, ReactNode, useContext } from "react";
import { BranchProps } from "@/types/BranchType";

interface UserAdminProps {
    branch: BranchProps;
}

export const UserAdminContext = createContext<UserAdminProps | null>(null)

export const UserAdminProvider = ({children, branch}: {children: ReactNode, branch: BranchProps}) => {
    
    return(
        <UserAdminContext.Provider value={{
            branch
        }}>
            {children}
        </UserAdminContext.Provider>
    )
}

export const useUserAdmin = () => {
    const context = useContext(UserAdminContext);
    if (!context) {
        throw new Error("useUserAdmin must be used inside UserAdminProvider");
    }
    return context;
}