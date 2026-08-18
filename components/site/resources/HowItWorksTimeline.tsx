import { QrCode, LayoutTemplate, ChefHat, Star } from 'lucide-react'
import { SmallHeader } from '../SmallHeader'
import { Header } from '../Header'
import { DescHeader } from '../DescHeader'

export const HowItWorksTimeline = () => {
    const steps = [
        {
            num: "01",
            title: "Guest scans the QR code",
            desc: "A QR code sits on every table. Guest points their camera — menu opens instantly in their browser. No app, no account, no delay.",
            icon: QrCode,
            bgColor: "bg-[#F97316]"
        },
        {
            num: "02",
            title: "Browses & places order",
            desc: "Photo-rich menus, categories, special requests. Guest adds items and submits — order is sent instantly to your kitchen and dashboard.",
            icon: LayoutTemplate,
            bgColor: "bg-[#0E8A54]"
        },
        {
            num: "03",
            title: "Kitchen receives instantly",
            desc: "No shouting, no paper tickets. The order appears live on your kitchen display the moment it's placed, color-coded by status.",
            icon: ChefHat,
            bgColor: "bg-red-400"
        },
        {
            num: "04",
            title: "Served fast, guests happy",
            desc: "Faster prep, fewer mistakes, higher table turnover. Guests can reorder any time without flagging down staff.",
            icon: Star,
            bgColor: "bg-slate-900"
        }
    ]

    return (
        <section className="bg-white py-24 px-5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <SmallHeader text='HOW IT WORKS' color='#F67D26' />
                    <Header text='From Scan to Served in Minutes' />
                    <DescHeader text="The entire order lifecycle, automated and seamless." /> 
                </div>

                <div className="relative">
                    {/* Horizontal Line for Desktop */}
                    <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-px bg-gray-200 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-start md:items-center text-left md:text-center">
                                <div className={`${step.bgColor} w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-md shadow-gray-200/50`}>
                                    <step.icon className="text-white w-8 h-8" />
                                </div>
                                <div className="text-gray-300 font-black text-3xl mb-2">{step.num}</div>
                                <h4 className="text-base font-bold text-slate-900 mb-3">{step.title}</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}