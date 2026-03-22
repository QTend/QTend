import { foods } from "@/constant/foods"


const tableHeads = [
    'Meny items',
    'Number of 0rders',
    'Price',
    'Revenue in past week'
]

export default function Analytics () {

    const analytics = [
        {id: 1, label: 'Total Sales', icon: '', value: '₦199,000', stats: '+12.5% from last week' },
        {id: 2, label: 'Orders', icon: '', value: 179, stats: '+12.5% from last week' },
        {id: 3, label: 'Avg Order', icon: '', value: '₦1,112', stats: '+12.5% from last week' },
        {id: 4, label: 'Menu Items', icon: '', value: 24, stats: '+12.5% from last week' },
    ]
    
    return  (
        <div className="grid gap-5">
            {/* stats */}
            <div className="flex justify-between items-center gap-4">
                {
                    analytics.map((a, index) => (
                        <div key={index} className="bg-white p-5 rounded-xl grid gap-5 flex-1 border border-[#0000001A]">
                            <div className="flex justify-between items-center">
                                <p className="text-[#666666]">{a.label}</p>
                                <p>Icon</p>
                            </div>

                            <p>{a.value}</p>

                            <p>{a.stats}</p>

                        </div>
                    ))
                }
            
            </div>

        {/* analytics */}
        <div className="p-5 bg-white rounded-xl ">
            <p className="text-xl">Sales Trend</p>
        </div>

        {/* table */}
        <div className="p-5 bg-white rounded-xl ">
            <p className="text-xl">Top 5 Menu Items</p>

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
                    <tr key={index} className="cursor-pointer">
                        <td className="py-4 px-6 text-left">{f.name}</td>
                        <td className="py-4 px-6 text-left">{f.description}</td>
                        <td className="py-4 px-6 text-left">{f.price}</td>
                        <td className="py-4 px-6 text-left">
                            <p className="text-[#027A48] text-sm border-2 border-[#039855] rounded-2xl w-fit py-1 px-3">4%</p>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>

        </div>
        
    )
}   