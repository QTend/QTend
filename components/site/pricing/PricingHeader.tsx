import { Tag } from "lucide-react"

export const PricingHeader = ({ isAnnual, setIsAnnual }: { isAnnual: boolean, setIsAnnual: (val: boolean) => void }) => {
    return (
        <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 mb-6">
                <Tag size={16} className="text-[#F97316]" />
                Simple pricing, no surprises
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                Start Free.<br />
                <span className="text-[#F97316]">Scale as You Grow.</span>
            </h2>
            
            <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto">
                No setup fees. No hidden costs. Cancel any time. Every paid plan comes with a 14-day free trial.
            </p>

            {/* Monthly / Annually Toggle */}
            <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
                <button 
                    onClick={() => setIsAnnual(!isAnnual)}
                    className="w-14 h-8 bg-[#F97316] rounded-full p-1 transition-colors relative"
                >
                    <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
                <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>Annually</span>
                    <span className="bg-[#0E8A54] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        Save 20%
                    </span>
                </div>
            </div>
        </div>
    )
}