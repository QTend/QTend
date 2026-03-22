'use client'

import { AddMenu } from "@/components/userAdmin/ui/ActionButtons/AddMenu";
import { EditMenu } from "@/components/userAdmin/ui/EditMenu";
import Switch from "@/components/userAdmin/ui/Switch";
import { foods } from "@/constant/foods";
import { EllipsisVertical, List, Plus } from "lucide-react";


const tableHeads = [
    'Meny items',
    'Descriptions',
    'Price',
    'Availability'
]

export default function Menu () {

    const formatNaira = (amount: number) => 
    `₦${Math.round(amount).toLocaleString('en-NG')}`;

    const addNaira = (...nums: number[]) => 
    formatNaira(nums.reduce((a, b) => a + b, 0));


    return  (
        <div className="bg-white rounded-2xl">
            <div className="flex justify-between items-center py-6 px-6">
                <div className="flex items-center gap-5">
                <p className="text-xl">All items</p>
                <div className="w-11 h-11 bg-[#F67D2626] rounded-xl flex justify-center items-center cursor-pointer">
                <List strokeWidth={3} />
                </div>
                </div>
                <AddMenu />
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
                        {foods.map((f, index) => (
                        <tr key={index} className="group cursor-pointer hover:bg-linear-to-r from-[#f67d261b] to-[#68a54429]">
                            <td className="py-4 px-6 text-left  flex items-center gap-2"><div className="w-14 h-14 bg-orange-500 rounded-xl" />{f.name}</td>
                            <td className="py-4 px-6 text-left">{f.description}</td>
                            <td className="py-4 px-6 text-left text-[#F47C26] ">{addNaira  (f.price)}</td>
                            <td className="py-4 px-6 text-left"><div className="flex items-center gap-7">
                              <Switch enabled={false} onClick={() => {}} />
                              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <EditMenu />
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