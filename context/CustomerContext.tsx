'use client'

import { CustomerProps } from "@/types/CustomerType";
import { useSearchParams } from "next/navigation";
import { createContext, ReactNode, useContext } from "react";


interface ContextProps {
    branch: CustomerProps;
    table: string | null;
    isBasic: boolean; 
    isFree: boolean;
    canInteract: boolean;
    hasTable: boolean
}


const customerContext = createContext<ContextProps | null>(null)

export const CustomerProvider = ({children, branch, isBasic, isFree}: {children: ReactNode, branch: CustomerProps, isBasic: boolean, isFree: boolean}) => {
    const searchParams = useSearchParams()
    const table = searchParams.get('table')

    const hasTable = !!table 
    
      const canInteract = !isBasic && !isFree && hasTable
    return(
        <customerContext.Provider value={{branch, table, isBasic, isFree, hasTable, canInteract}}>
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