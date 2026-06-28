'use client'

import { createContext, ReactNode, useContext } from "react";
import { BranchProps } from "@/types/BranchType";

interface UserAdminProps {
    branch: BranchProps;
    user: any;
}

export const UserAdminContext = createContext<UserAdminProps | null>(null)

export const UserAdminProvider = ({children, branch, user}: {children: ReactNode, branch: BranchProps, user: any}) => {
    
    return(
        <UserAdminContext.Provider value={{
            branch,
            user
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