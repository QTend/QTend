'use client'
import { CalendarDays, ChevronDown, List, Search } from "lucide-react";
import { AddMenu } from "@/components/userAdmin/ui/ActionButtons/AddMenu";
import { ManageCategory } from "@/components/userAdmin/ui/ActionButtons/ManageCategory";
import Switch from "./Switch";
import { EditMenu } from "./EditMenu";
import { useEffect, useState } from "react";
import { MenuItem } from "@/types/MenuItemType";
import { useToast } from "@/context/ToastContext";
import { useMenuItem } from "@/context/MenuItemContext";
import { useCategory } from "@/context/CategoryContext";
import { CategoryProps } from "@/types/MenuCategoyType";
import EmptyMenuItem from "./EmptyMenuItem";
import { LoadingSpiner } from "@/components/LoadingSpiner";
import { Pagination } from "./Pagination";
import { useUserAdmin } from "@/context/UserAdminContext";
import Image from "next/image";

const tableHeads = [
    'Menu items',
    'Descriptions',
    'Category',
    'Price',
    'Availability'
]

export default function MenuTable(){
    const {branch} = useUserAdmin()
    const {menuItems, refreshMenuItems, search, setSearch, isLoading, currentPage, setCurrentPage, totalPages } = useMenuItem()
    const {showToast} = useToast()
    const {categories, categoryLoad} = useCategory()
    const [dropDown, setDropDown] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>(null)
    const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

    useEffect(() => {
        refreshMenuItems();
    },[])

    const handleFilterCategory = async (c: CategoryProps) => {
        setSelectedCategory(c)
        refreshMenuItems(c._id)
        setDropDown(false)
    }

    const getParentCategory = (categoryId: any) => {
        const id = typeof categoryId === 'object' ? categoryId?._id : categoryId;
        return categories.find((c) => c._id === id);
    };

    const handleToggle = async (menu: MenuItem) => {
        const parentCat = getParentCategory(menu.categoryId);
        const isCategoryAvailable = parentCat ? parentCat.isAvailable : true;


        if (!isCategoryAvailable) {
            showToast("Category has to be available first", "error");
            return;
        }

        setTogglingItemId(menu._id ?? null);

        try {
          const res = await fetch(`/api/user-admin/${branch._id}/menu/item`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              itemId: menu._id, // <--- BUG FIX: Added the missing itemId required by our API!
              isAvailable: !menu.isAvailable 
            }),
          });
    
          if (res.ok) {
            showToast("Menu item visibility updated", "success");
            refreshMenuItems(); 
          } else {
            showToast("Failed to update visibility", "error");
          }
        } catch (error) {
          showToast("Something went wrong", "error");
        } finally {
            // 3. Clear the loading state
            setTogglingItemId(null); 
        }
    }
    
    const formatNaira = (amount: number) => 
    `₦${Math.round(amount).toLocaleString('en-NG')}`;

    const addNaira = (...nums: number[]) => 
    formatNaira(nums.reduce((a, b) => a + b, 0));

    return (
        <div className="bg-white h-full rounded-2xl">
            <div className="flex justify-between items-center py-6 px-6">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border-[#CFD9E4] cursor-pointer border rounded-lg px-4 py-1">
                        <Search color="#667085" size={18} />
                        <input 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search"
                        className="outline-none"
                        />
                    </div>

                    <div onClick={() => setDropDown(!dropDown)} className="flex items-center relative gap-3 border-[#CFD9E4] cursor-pointer border rounded-lg px-4 py-2">
                        <CalendarDays size={12} />
                        <p className="text-xs font-medium text-[#203751]">{ selectedCategory ? selectedCategory.name : 'All category'}</p>
                        <ChevronDown size={12} />

                        { dropDown && ( 
                            <div className="no-scrollbar absolute top-10 left-0 w-50 max-h-60 overflow-y-auto bg-white border-[#CFD9E4] border rounded-xl z-10"> 
                                <p  onClick={() => {
                                    setSelectedCategory(null)
                                    refreshMenuItems()
                                }} className="px-2 py-3 border-b hover:bg-[#68A5441A] border-[#F0F0F0]">
                                All category
                                </p>
                                {categories.map(c => ( 
                                c.isAvailable && (
                                    <p key={c._id} onClick={() =>handleFilterCategory(c)} className="px-2 py-3 border-b hover:bg-[#68A5441A] border-[#F0F0F0]">
                                    {c.name}
                                    </p>
                                )
                                ))} 
                            </div> 
                            )}

                    </div>
                </div>
                {/* s */}
                <div className="flex items-center gap-2">
                    <AddMenu branchId={branch._id}  />
                    <ManageCategory branchId={branch._id} />
                </div>
            </div>
            
            {
                categoryLoad && isLoading || togglingItemId
                ? <LoadingSpiner />
                : (
                    <div>
                        {menuItems.length === 0 ? <EmptyMenuItem /> : (
                            <>
                            <table className="w-full">
                                <thead className="text-left bg-[#68A5441A]">
                                    <tr>
                                    {tableHeads.map((th, index) => (
                                        <th key={index} className="py-4 px-6 text-left font-normal">{th}</th>
                                    ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {menuItems.map((f) => {
                                        const parentCat = getParentCategory(f.categoryId);
                                        const isCategoryAvailable = parentCat ? parentCat.isAvailable : true;
                                        
                                        const visuallyAvailable = f.isAvailable && isCategoryAvailable;
                                        return(
                                            <tr key={f._id} className="group cursor-pointer text-[#333333] hover:bg-linear-to-r from-[#f67d261b] to-[#68a54429]">
<td className="py-4 px-6 text-left flex items-center gap-3">
    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {f.image?.url ? (
            <Image 
                src={f.image.url} 
                alt={f.name} 
                fill 
                className="object-cover"
            />
        ) : (
            // Fallback if no image exists
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-[10px] text-gray-400">No Img</span>
            </div>
        )}
    </div>
    <span className="font-medium text-[#101828]">{f.name}</span>
</td>                                                
                                                <td className="py-4 px-6 text-left">
                                                    <p className="text-sm line-clamp-2 max-w-62.5 leading-relaxed">
                                                        {f.description}
                                                    </p>
                                                </td> 
                                                <td className="py-4 px-6 text-left">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium">
                                                        {typeof f.categoryId === 'object' ? f.categoryId.name : 'Uncategorized'}
                                                    </span>
                                                </td>
                                                                                
                                                <td className="py-4 px-6 text-left text-[#F47C26] ">{addNaira(Number(f.price))}</td>
                                                <td className="py-4 px-6 text-left">
                                                    <div className="flex items-center gap-7">
                                                        <div className={`transition-opacity ${togglingItemId === f._id ? 'opacity-50 pointer-events-none animate-pulse' : ''}`}>
                                                            {/* Pass visuallyAvailable instead of f.isAvailable */}
                                                            <Switch enabled={visuallyAvailable}  onClick={() => handleToggle(f)}  />
                                                        </div>
                                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <EditMenu 
                                                            menu={f} 
                                                            branchId={branch._id} 
                                                            onSuccess={refreshMenuItems} 
                                                            />
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>

                            <Pagination 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                onPageChange={(page) => setCurrentPage(page)} 
                            />
                            </>
                            
                        )}
                        
                    </div>
                 )
            }
            
        </div>
    )
}