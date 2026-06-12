'use client'

import { CustomerProps } from "@/types/CustomerType";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";


interface ContextProps {
    branch: CustomerProps;
    table: string | null
}


const customerContext = createContext<ContextProps | null>(null)

export const CustomerProvider = ({children, branch}: {children: ReactNode, branch: CustomerProps}) => {
    const searchParams = useSearchParams()
    const table = searchParams.get('table')
    return(
        <customerContext.Provider value={{branch, table}}>
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