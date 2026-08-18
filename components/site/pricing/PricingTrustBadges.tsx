import { Headphones, ShieldCheck, Zap } from "lucide-react"

export const PricingTrustBadges = () => {
    return (
        <div className="bg-gray-50 py-8 border-y border-gray-100 mb-20">
            <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center  border border-gray-100">
                        <Zap className="text-[#0E8A54]" size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Setup in 20 minutes</h4>
                        <p className="text-gray-500 text-xs">Go live the same day</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center  border border-gray-100">
                        <Headphones className="text-[#0E8A54]" size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Live support</h4>
                        <p className="text-gray-500 text-xs">Real humans, fast replies</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-100">
                        <ShieldCheck className="text-[#0E8A54]" size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">99.9% uptime SLA</h4>
                        <p className="text-gray-500 text-xs">Always available for your guests</p>
                    </div>
                </div>
            </div>
        </div>
    )
}