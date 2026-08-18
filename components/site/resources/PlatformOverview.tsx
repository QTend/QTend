import { Smartphone, Monitor, BarChart2, CheckCircle2 } from 'lucide-react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'

export const PlatformOverview = () => {
    const systems = [
        {
            tag: "GUEST EXPERIENCE",
            title: "Ordering that feels effortless",
            desc: "Guests scan, browse, and order in seconds. No app, no friction, no waiting for a waiter. Beautiful menus that open instantly on any phone.",
            icon: Smartphone,
            color: "text-[#F97316]",
            bgColor: "bg-orange-500",
            checkColor: "text-orange-500",
            features: ["Instant QR menu load", "No app or account needed", "Photo-rich menu display", "Real-time order status"]
        },
        {
            tag: "RESTAURANT DASHBOARD",
            title: "Complete command center",
            desc: "Your team sees every order the moment it lands. Manage tables, update the menu, and track performance — all from one screen.",
            icon: Monitor,
            color: "text-[#0E8A54]",
            bgColor: "bg-[#0E8A54]",
            checkColor: "text-[#0E8A54]",
            features: ["Live order feed", "Kitchen display system", "Instant menu edits", "Staff role management"]
        },
        {
            tag: "BUSINESS INTELLIGENCE",
            title: "Data that drives decisions",
            desc: "Know what's selling, when you're busiest, and which tables generate the most revenue. Make smarter decisions every day.",
            icon: BarChart2,
            color: "text-red-500",
            bgColor: "bg-red-500",
            checkColor: "text-red-500",
            features: ["Daily & weekly revenue", "Peak hour tracking", "Best-selling items", "Per-table analytics"]
        }
    ]

    return (
        <section className="bg-gray-50 py-24 px-5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <SmallHeader text='PLATFORM' color='#0E8A54' />
                    <Header text='Three Systems. One Seamless Platform.' />
                    <DescHeader text=" QTend unifies the guest ordering experience, your operations layer, and your business analytics into a single product." /> 
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {systems.map((sys, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full">
                            <div className={`${sys.bgColor} w-12 h-12 rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                                <sys.icon className="text-white w-6 h-6" />
                            </div>
                            <p className="text-gray-400 text-xs font-bold tracking-wider mb-2 uppercase">{sys.tag}</p>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{sys.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">
                                {sys.desc}
                            </p>
                            <ul className="space-y-3">
                                {sys.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-3">
                                        <CheckCircle2 className={`w-5 h-5 ${sys.checkColor} fill-current/10`} />
                                        <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}