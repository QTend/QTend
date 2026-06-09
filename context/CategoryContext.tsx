'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BranchProps } from "@/types/BranchType";
import { useToast } from "./ToastContext";
import { CategoryProps } from "@/types/MenuCategoyType";

interface ContextProps {
    categories: CategoryProps[];
    categoryLoad: boolean;
    refreshCategories: () => Promise<void>
}

export const CategoryContext = createContext<ContextProps | null>(null)

export const CategoryProvider = ({children, branch}: {children: ReactNode, branch: BranchProps}) => {
    const {showToast} = useToast();
    const [categories, setCategories] = useState([]);
    const [categoryLoad, setCategoryLoad] = useState(true);


    const fetchCategories = async () => {
        try {
        const res = await fetch(`/api/user-admin/${branch._id}/menu/category`)
        const data = await res.json();

        if (!res.ok) {
            showToast(data.error, "error")
            throw new Error(data.error || 'Failed to add category');
        }

        setCategories(data.categories || [])
        } catch (error: any) {
        showToast(error.message || 'Something went wrong', 'error')
        } finally {
        setCategoryLoad(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, []);

    return(
        <CategoryContext.Provider value={{
            categories,
            categoryLoad,
            refreshCategories: fetchCategories
        }}>
            {children}
        </CategoryContext.Provider>
    )
}

export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error("useCategory must be used inside CategoryProvider");
    }
    return context;
}