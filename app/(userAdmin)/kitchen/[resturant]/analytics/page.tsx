import { foods } from "@/constant/foods"

export default function Analytics () {
    const tableHeads = [
    'Meny items',
    'Number of 0rders',
    'Price',
]
    return  (
        <div className="grid gap-5">
            {/* stats */}
            <div className="flex justify-between items-center gap-4">
            <div className="bg-white p-5 rounded-xl grid gap-5 flex-1 border border-[#0000001A]">
                <div className="flex justify-between items-center">
                    <p>Total Sales</p>
                    <p>Icon</p>
                </div>

                <p>$199,00</p>

                <p>+ 12.5% from last week</p>

            </div>
            <div className="bg-white p-5 rounded-xl flex-1 grid gap-5">
                <div className="flex justify-between items-center">
                    <p>Total Sales</p>
                    <p>Icon</p>
                </div>

                <p>$199,00</p>

                <p>+ 12.5% from last week</p>

            </div>
            <div className="bg-white p-5 rounded-xl flex-1 grid gap-5">
                <div className="flex justify-between items-center">
                    <p>Total Sales</p>
                    <p>Icon</p>
                </div>

                <p>$199,00</p>

                <p>+ 12.5% from last week</p>

            </div>
            <div className="bg-white p-5 rounded-xl flex-1 grid gap-5">
                <div className="flex justify-between items-center">
                    <p>Total Sales</p>
                    <p>Icon</p>
                </div>

                <p>$199,00</p>

                <p>+ 12.5% from last week</p>

            </div>
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
                                        <td className="py-4 px-6 text-left ">{f.price}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
        </div>

        </div>
        
    )
}   