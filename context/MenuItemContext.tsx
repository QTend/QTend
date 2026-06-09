'use client'

import { MenuItem } from "@/types/MenuItemType";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import { fetchMenuItems } from "@/lib/fetchMenuItems";
import { BranchProps } from "@/types/BranchType";

interface MenuContextType {
    menuItems: MenuItem[];
    isLoading: boolean;
    refreshMenuItems: (categoryId?: string) => void;
    setSearch: (search: string) => void;
    search: string;
    // --- NEW: Pagination Exports ---
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number) => void;
}

const MenuItemContext = createContext<MenuContextType | null>(null)

export const MenuItemProvider = ({children, branch}: {children: ReactNode, branch: BranchProps}) => {
    const {showToast} = useToast();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // --- NEW: Pagination & Category State ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [activeCategory, setActiveCategory] = useState("");

    // 1. Fetch whenever the page or the active category changes
    useEffect(() => {
        fetchMenu(activeCategory);
    }, [currentPage, activeCategory])

    // 2. Handle search with a debounce
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            // If we search, we want to go back to page 1.
            if (currentPage !== 1) {
                setCurrentPage(1); // This state change will auto-trigger the useEffect above
            } else {
                fetchMenu(activeCategory); // If we are already on page 1, fetch immediately
            }
        }, 2000)
        return () => clearTimeout(delaySearch)
    }, [search])

    const fetchMenu = async(categoryId = activeCategory) => {
        setIsLoading(true)
        
        // Keep track of which category is currently selected for pagination
        if (categoryId !== activeCategory) {
            setActiveCategory(categoryId);
        }

        try {
            // Pass the currentPage to your updated fetch utility
            const data = await fetchMenuItems({ 
                branchId: branch._id, 
                categoryId, 
                q: search,
                page: currentPage 
            });
            
            setMenuItems(data.items || []);
            setTotalPages(data.totalPages || 1); // Update the total pages from the API response
        } catch (err: any) {
            console.log(err.message || 'Failed to fetch Menu')
            showToast(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <MenuItemContext.Provider value={{
            menuItems,
            isLoading,
            search, 
            setSearch,
            refreshMenuItems: (categoryId = "") => {
                // Reset to page 1 when manually refreshing or switching categories
                if (currentPage !== 1) {
                    setCurrentPage(1);
                    setActiveCategory(categoryId);
                } else {
                    fetchMenu(categoryId);
                }
            },
            currentPage,
            totalPages,
            setCurrentPage
        }}>
            {children}
        </MenuItemContext.Provider>
    )
}

export const useMenuItem = () => {
    const context = useContext(MenuItemContext);

    if (!context) {
        // Just fixed a tiny typo here from ToastProvider to MenuItemProvider!
        throw new Error("useMenuItem must be used inside MenuItemProvider"); 
    }

    return context;
}