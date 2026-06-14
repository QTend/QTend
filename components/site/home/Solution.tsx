import { ChefHat, QrCode, Star, Table2 } from "lucide-react"
import { DescHeader } from "../DescHeader"
import { Header } from "../Header"
import { SmallHeader } from "../SmallHeader"

const solution = [
    {id:1, number: '01', icon: QrCode, label: 'Scan', desc: 'Guest scans the QR code on their table. No app, no login, no friction — opens instantly in their browser.', color: '#F67D26'},
    {id:2, number: '02', icon: Table2, label: 'Order', desc: 'Browse your digital menu,customize items, and place an order directly from their phone.', color: '#0E8A54'},
    {id:3, number: '03', icon: ChefHat, label: 'Prepare', desc: 'Orders land instantly on the kitchen display and staff dashboard. No shouting, nopaper, no mistakes.', color: '#FF6F61'},
    {id:4, number: '04', icon: Star, label: 'Serve', desc: "Faster turnaround, happy guests, higher table turnover — and your team isn't running circles anymore.", color: '#1D1D1F'},
]

export const Solution = () => {
  return (
    <section className="px-4 py-12 md:p-16">
    <SmallHeader color="#0E8A54" text="THE SOLUTION" />
    <Header text="One QR Code. Complete Ordering Experience." />
    <DescHeader text="From scan to serve — QTend connects your guests and kitchen in a seamless, digital flow." />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-10 md:mt-16 max-w-desktop mx-auto">
        {
            solution.map(s => {
                const IconComponent = s.icon;
            return (
                <div
                key={s.id}
                style={{borderTopColor: s.color}}
                className="bg-[#F7F7F7] border-t-2 rounded-2xl grid gap-4 md:gap-6 py-8 px-6 md:py-12 md:px-4"
                >
                    <p 
                    className="font-bold text-3xl md:text-4xl"  
                    style={{
                        color: `color-mix(in srgb, ${s.color} 50%, transparent)` 
                    }}>
                    {s.number}
                    </p>
                    <div className="w-10 h-10 bg-[#FFFFFF] flex justify-center items-center border border-[#E8E8E8] rounded-lg">
                    <IconComponent className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xl text-[#1D1D1F]">{s.label}</p>
                    <p className="text-sm text-[#6B6B6B]">{s.desc}</p>
                </div>
            )})
        }
        
    </div>
    </section>
  )
}