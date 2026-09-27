'use client'
import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { AddMenu } from "@/components/userAdmin/ui/ActionButtons/AddMenu";
import { ManageCategory } from "@/components/userAdmin/ui/ActionButtons/ManageCategory";
import Switch from "./Switch";
import { EditMenu } from "./EditMenu";
import { useState } from "react";
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

const tableHeads = ['Menu items', 'Descriptions', 'Zone', 'Category', 'Price', 'Availability']

export default function MenuTable(){
    const {branch} = useUserAdmin()
    const {menuItems, refreshMenuItems, search, setSearch, isLoading, currentPage, setCurrentPage, totalPages } = useMenuItem()
    const {showToast} = useToast()
    const {categories, categoryLoad} = useCategory()
    const [dropDown, setDropDown] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryProps | null>(null)
    const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

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
              itemId: menu._id, 
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
            setTogglingItemId(null); 
        }
    }
    
    const formatNaira = (amount: number) => `₦${Math.round(amount).toLocaleString('en-NG')}`;

    return (
        <div className="bg-white h-full md:rounded-2xl border-t md:border-none border-gray-100">
            {/* Top Action Bar - Wraps on mobile */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-4 md:py-6 md:px-6 gap-4">
                
                {/* Search & Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none flex items-center gap-2 border-[#CFD9E4] bg-gray-50 md:bg-white border rounded-xl px-3 py-2">
                        <Search color="#667085" size={18} />
                        <input 
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search menu..."
                            className="outline-none bg-transparent w-full min-w-[120px] text-sm"
                        />
                    </div>

                    <div onClick={() => setDropDown(!dropDown)} className="flex items-center relative gap-2 border-[#CFD9E4] bg-gray-50 md:bg-white border rounded-xl px-3 py-2 cursor-pointer shrink-0">
                        <CalendarDays size={14} className="text-gray-500" />
                        <p className="text-sm font-medium text-[#203751] hidden xs:block">
                            {selectedCategory ? selectedCategory.name : 'All'}
                        </p>
                        <ChevronDown size={14} className="text-gray-500" />

                        {dropDown && ( 
                            <div className="absolute top-full mt-2 left-0 w-48 max-h-60 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl z-50"> 
                                <p onClick={() => { setSelectedCategory(null); refreshMenuItems(); }} className="px-4 py-3 border-b text-sm hover:bg-gray-50 cursor-pointer">
                                    All categories
                                </p>
                                {categories.map(c => ( 
                                    c.isAvailable && (
                                        <p key={c._id} onClick={() => handleFilterCategory(c)} className="px-4 py-3 border-b text-sm hover:bg-gray-50 cursor-pointer">
                                            {c.name}
                                        </p>
                                    )
                                ))} 
                            </div> 
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    <AddMenu branchId={branch._id}  />
                    <ManageCategory branchId={branch?._id} branchSlug={branch?.slug} />
                </div>
            </div>
            
            {categoryLoad && isLoading || togglingItemId ? (
                <div className="py-20"><LoadingSpiner /></div>
            ) : (
                <div>
                    {menuItems.length === 0 ? <EmptyMenuItem /> : (
                        <>
                            {/* DESKTOP TABLE VIEW */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="text-left bg-[#68A5441A]">
                                        <tr>
                                        {tableHeads.map((th, index) => (
                                            <th key={index} className="py-4 px-6 text-left font-normal text-gray-600">{th}</th>
                                        ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menuItems.map((f) => {
                                            const parentCat = getParentCategory(f.categoryId);
                                            const visuallyAvailable = f.isAvailable && (parentCat ? parentCat.isAvailable : true);
                                            return(
                                                <tr key={f._id} className="group cursor-pointer text-[#333333] hover:bg-[#68A5440A] border-b border-gray-50">
                                                    <td className="py-4 px-6 text-left flex items-center gap-3">
                                                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                            {f.image?.url ? <Image src={f.image.url} alt={f.name} fill className="object-cover" unoptimized /> : <div className="w-full h-full flex items-center justify-center bg-gray-100"><span className="text-[10px] text-gray-400">No Img</span></div>}
                                                        </div>
                                                        <span className="font-medium text-[#101828]">{f.name}</span>
                                                    </td>                                                
                                                    <td className="py-4 px-6"><p className="text-sm line-clamp-2 max-w-[200px] text-gray-500">{f.description}</p></td> 
                                                    <td className="py-4 px-6"><p className="text-sm text-gray-500">{f.zoneId?.name}</p></td>
                                                    <td className="py-4 px-6"><span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">{typeof f.categoryId === 'object' ? f.categoryId?.name : 'Uncategorized'}</span></td>
                                                    <td className="py-4 px-6 font-bold text-[#F67D26]">{formatNaira(Number(f.price))}</td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-6">
                                                            <div className={`transition-opacity ${togglingItemId === f._id ? 'opacity-50 pointer-events-none' : ''}`}>
                                                                <Switch enabled={visuallyAvailable} onClick={() => handleToggle(f)}  />
                                                            </div>
                                                            <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <EditMenu menu={f} branchId={branch._id} onSuccess={refreshMenuItems} />
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* MOBILE LIST VIEW */}
                            <div className="md:hidden flex flex-col px-4 space-y-3 pb-6">
                                {menuItems.map((f) => {
                                    const parentCat = getParentCategory(f.categoryId);
                                    const visuallyAvailable = f.isAvailable && (parentCat ? parentCat.isAvailable : true);
                                    return (
                                        <div key={f._id} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex gap-3 relative overflow-hidden">
                                            {/* Visual Overlay for Out of Stock */}
                                            {!visuallyAvailable && <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none"></div>}
                                            
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                {f.image?.url ? <Image src={f.image.url} alt={f.name} fill className="object-cover" unoptimized /> : <div className="w-full h-full flex items-center justify-center bg-gray-100"><span className="text-xs text-gray-400">No Img</span></div>}
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="font-bold text-[#101828] text-sm leading-tight pr-2">{f.name}</h3>
                                                        <span className="font-bold text-[#F67D26] text-sm shrink-0">{formatNaira(Number(f.price))}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{f.description}</p>
                                                </div>
                                                
                                                <div className="flex justify-between items-center mt-2 z-20">
                                                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                                                        {typeof f.categoryId === 'object' ? f.categoryId?.name : 'Uncategorized'}
                                                    </span>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <EditMenu menu={f} branchId={branch._id} onSuccess={refreshMenuItems} />
                                                        <div className={togglingItemId === f._id ? 'opacity-50' : ''}>
                                                            <Switch enabled={visuallyAvailable} onClick={() => handleToggle(f)} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="px-4 py-2 md:p-0">
                                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
                            </div>
                        </> 
                    )}
                </div>
            )}
        </div>
    )
}