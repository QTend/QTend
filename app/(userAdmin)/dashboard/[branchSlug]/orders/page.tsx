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
            {/* header */}
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


            <div className="bg-white rounded-2xl p-4 mt-5">
                <div className="flex justify-between ">
                    <div className="grid gap-1">
                    <p className="text-[#333333]">ORD-001</p>
                    <p className="text-sm text-[#666666]">2 min ago</p>
                    </div>
                    <ChevronDown />
                </div>

                <p className="text-[#333333] text-sm my-5">Table: {' '}<span className="text-sm font-bold">#5</span></p>

                <div className="flex justify-between items-end text-sm text-[#333333]">
                    <div className="grid gap-1">
                        <p className="text-[#666666]">Items: </p>
                        <p>2x Jollof Rice with Chicken</p>
                        <p>2x Chapman</p>
                    </div>
                    <div className="grid gap-1">
                        <p>₦5,000</p>
                        <p>₦1,000</p>
                    </div>
                </div>

                <div className="mt-5 flex justify-between items-end border-t border-t-[#0000001A] pt-5">
                    <div>
                        <p className="text-sm text-[#666666]">Total</p>
                        <p className="text-[#F47C26] font-medium text-xl">₦6,000</p>
                    </div>
                    <div className="bg-[#2E90FA] text-sm text-white rounded-xl py-2 px-4">Mark In Progress</div>
                </div>
                
            </div>
            
        </div>
    )
}