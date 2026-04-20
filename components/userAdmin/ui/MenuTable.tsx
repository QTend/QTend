'use client'
import { CalendarDays, ChevronDown, List } from "lucide-react";
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

const tableHeads = [
    'Menu items',
    'Descriptions',
    'Category',
    'Price',
    'Availability'
]

export default function MenuTable({branch}:{branch: {_id: string}}){
    const {menuItems, refreshMenuItems, isLoading } = useMenuItem()
    const {showToast} = useToast()
    const {categories} = useCategory()
    const [dropDown, setDropDown] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)



    // 1. Add state to track which specific item is currently toggling
    const [togglingItemId, setTogglingItemId] = useState<string | null>(null);

    useEffect(() => {
        refreshMenuItems();
    },[])

    const handleFilterCategory = async (c: CategoryProps) => {
        setSelectedCategory(c.name)
        await refreshMenuItems(c._id)
        setDropDown(false)
    }

    const handleToggle = async (menu: MenuItem) => {
        // 2. Start the loading state for this specific row
        setTogglingItemId(menu._id ?? null);

        try {
          const res = await fetch(`/api/user-admin/menu/${branch._id}/item`, {
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
        <div className="bg-white rounded-2xl">
            <div className="flex justify-between items-center py-6 px-6">
                <div className="flex items-center gap-2">
                    {/* <div className="flex items-center gap-3 border-[#CFD9E4] cursor-pointer border rounded-lg px-4 py-2">
                        <CalendarDays size={12} />
                        <p className="text-xs font-medium text-[#203751]">All time</p>
                        <ChevronDown size={12} />
                    </div> */}

                    <div onClick={() => setDropDown(!dropDown)} className="flex items-center relative gap-3 border-[#CFD9E4] cursor-pointer border rounded-lg px-4 py-2">
                        <CalendarDays size={12} />
                        <p className="text-xs font-medium text-[#203751]">{ selectedCategory ? selectedCategory : 'All category'}</p>
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

            <div>
                <table className="w-full">
                    <thead className="text-left bg-[#68A5441A]">
                        <tr>
                        {tableHeads.map((th, index) => (
                            <th key={index} className="py-4 px-6 text-left font-normal">{th}</th>
                        ))}
                        </tr>
                    </thead>

                    <tbody>
                        {menuItems.map((f) => (
                        <tr key={f._id} className="group cursor-pointer text-[#333333] hover:bg-linear-to-r from-[#f67d261b] to-[#68a54429]">
                            <td className="py-4 px-6 text-left  flex items-center gap-2"><div className="w-14 h-14 bg-orange-500 rounded-xl" />{f.name}</td>
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
                                    {/* 4. Apply a visual loading effect and disable clicks while updating */}
                                    <div className={`transition-opacity ${togglingItemId === f._id ? 'opacity-50 pointer-events-none animate-pulse' : ''}`}>
                                        <Switch enabled={f.isAvailable}  onClick={() => handleToggle(f)}  />
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
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}