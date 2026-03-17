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
    return  (
        <div className="bg-white rounded-2xl">
            <div className="flex justify-between items-center py-6 px-6">
                <div className="flex items-center gap-5">
                <p className="text-xl">All items</p>
                <div className="w-11 h-11 bg-[#F67D2626] rounded-xl flex justify-center items-center cursor-pointer">
                <List strokeWidth={3} />
                </div>
                </div>
                <div className="flex items-center gap-1 text-[#68A544] border-[#68A544] border rounded-xl text-sm px-6 py-1 cursor-pointer"><Plus size={20} /> Add item</div>
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
                        <tr key={index} className="cursor-pointer hover:bg-linear-to-r from-[#f67d261b] to-[#68a54429]">
                            <td className="py-4 px-6 text-left  flex items-center gap-2"><div className="w-14 h-14 bg-orange-500 rounded-xl" />{f.name}</td>
                            <td className="py-4 px-6 text-left">{f.description}</td>
                            <td className="py-4 px-6 text-left ">{f.price}</td>
                            <td className="py-4 px-6 text-left"><div className="flex items-center gap-7">
                              <Switch />
                              <EditMenu/>
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