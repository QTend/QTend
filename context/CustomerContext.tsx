'use client'

import { CustomerProps } from "@/types/CustomerType";
import { createContext, ReactNode, useContext } from "react";


interface ContextProps {
    branch: CustomerProps
}


const customerContext = createContext<ContextProps | null>(null)

export const CustomerProvider = ({children, branch}: {children: ReactNode, branch: CustomerProps}) => {
    return(
        <customerContext.Provider value={{branch}}>
            {children}
        </customerContext.Provider>
    )
}


export const useCustomer = () => {
    const context = useContext(customerContext);
    
    if (!context) {
        // Just fixed a tiny typo here from ToastProvider to MenuItemProvider!
        throw new Error("useCustomer must be used inside CustomerProvider"); 
    }

    return context;
}