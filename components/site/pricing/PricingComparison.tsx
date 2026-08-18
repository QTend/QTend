import { Check, X } from "lucide-react";

export const PricingComparison = () => {
    // Structured data based on your specific plans
    const compareData = [
        { category: 'ORDERING' },
        { feature: 'Digital QR Menu', free: true, starter: true, pro: true },
        { feature: 'Order from phone (Self-serve)', free: false, starter: true, pro: true },
        { feature: 'Call Waiter Requests', free: false, starter: false, pro: true },
        { category: 'OPERATIONS' },
        { feature: 'Live Order Dashboard', free: false, starter: true, pro: true },
        { feature: 'Real-time alerts', free: false, starter: true, pro: true },
        { feature: 'Kitchen Display System (KDS)', free: false, starter: false, pro: true },
        { feature: 'Prep Zone Routing (Grill, Bar)', free: false, starter: false, pro: true },
        { category: 'MANAGEMENT' },
        { feature: 'Unlimited items & categories', free: true, starter: true, pro: true },
        { feature: 'Instant price updates', free: true, starter: true, pro: true },
        { feature: 'Advanced Analytics & Exports', free: false, starter: false, pro: true },
        { category: 'SUPPORT' },
        { feature: 'Community Support', free: true, starter: true, pro: true },
        { feature: 'Email & WhatsApp', free: false, starter: true, pro: true },
        { feature: 'Priority Queue', free: false, starter: false, pro: true },
    ];

    const renderIcon = (val: boolean) => {
        return val ? (
            <div className="mx-auto w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={14} className="text-[#0E8A54] stroke-[3]" />
            </div>
        ) : (
            <div className="mx-auto w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <X size={14} className="text-gray-400 stroke-[3]" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-5 mb-24">
            <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Compare Plans in Detail</h3>
                <p className="text-gray-500 text-sm">See exactly what's included in each plan before you decide.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="p-4 border-b border-gray-200 font-bold text-slate-900 w-2/5">Feature</th>
                            <th className="p-4 border-b border-gray-200 font-bold text-slate-900 text-center w-1/5">Free</th>
                            <th className="p-4 border-b border-gray-200 font-bold text-slate-900 text-center w-1/5">Starter</th>
                            <th className="p-4 border-b border-gray-200 font-bold text-[#F97316] text-center w-1/5">Pro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compareData.map((row, idx) => (
                            row.category ? (
                                <tr key={idx} className="bg-gray-50">
                                    <td colSpan={4} className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {row.category}
                                    </td>
                                </tr>
                            ) : (
                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-sm text-slate-700 font-medium">{row.feature}</td>
                                    <td className="p-4 text-center">{renderIcon(row.free as boolean)}</td>
                                    <td className="p-4 text-center">{renderIcon(row.starter as boolean)}</td>
                                    {/* Highlight Pro Column slightly */}
                                    <td className="p-4 text-center bg-orange-50/30">{renderIcon(row.pro as boolean)}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}