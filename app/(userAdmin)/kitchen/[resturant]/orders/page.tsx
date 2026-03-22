import { ChevronDown, SlidersVertical } from "lucide-react"

export default function Orders () {
    const stats = [
        {id: '1', label: 'All Orders'},
        {id: '2', label: 'Pending'},
        {id: '3', label: 'In Progress'},
        {id: '4', label: 'Conpleted'},
    ]
    

    return  (
        <div>
            <div className="flex items-center justify-between">
                <div className="bg-white p-2 flex items-center gap-2">
                {
                    stats.map(s => (
                        <div key={s.id} className="bg-[#68A544] text-white text-sm rounded-xl py-2 px-3 cursor-pointer">
                            {s.label}
                        </div>
                    ))
                }
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-white py-2 px-3 gap-1 rounded-xl border border-[#0000001F] cursor-pointer">
                        <SlidersVertical />
                        <p className="text-sm">Last 30 mins</p>
                        <ChevronDown />
                    </div>
                    <div className="flex items-center bg-white py-2 px-3 gap-1 rounded-xl border border-[#0000001F] cursor-pointer">
                        <p className="text-sm">All Orders</p>
                        <ChevronDown />
                    </div>
                </div>
            </div>
            
        </div>
    )
}