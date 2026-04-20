'use client'

import { MenuItem } from "@/types/MenuItemType";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import { fetchMenuItems } from "@/lib/fetchMenuItems";
import { BranchProps } from "@/types/BranchType";


interface MenuContextType {
    menuItems: MenuItem[];
    isLoading: boolean;
    refreshMenuItems: any
}

const MenuItemContext = createContext<MenuContextType | null>(null)


export const MenuItemProvider = ({children, branch}: {children: ReactNode, branch: BranchProps}) => {
    const {showToast} = useToast();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMenu();
    }, [])


    const fetchMenu = async(categoryId="") => {
        try {
            const items = await fetchMenuItems({ branchId: branch._id, categoryId });
            console.log('first', items)
            setMenuItems(items.items || []);
        } catch (err: any) {
            console.log(err.message || 'Failed to fetch Menu')
            showToast(err.message);
        }finally{
            setIsLoading(false);
        }
    }


    return(
        <MenuItemContext.Provider value={{
            menuItems,
            isLoading,
            refreshMenuItems: fetchMenu
        }}>
            {children}
        </MenuItemContext.Provider>
    )
}

export const useMenuItem = () => {
    const context = useContext(MenuItemContext);

    if (!context) {
        throw new Error("useToast must be used inside ToastProvider");
    }

    return context;
}