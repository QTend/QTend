import { DescHeader } from "../DescHeader"
import { Header } from "../Header"
import { SmallHeader } from "../SmallHeader"

const problems = [
    {id:1, number:'12 mins',  label: "Avg wait time per order", desc: 'Customers leave due to slow service', icon: ''},
    {id:2, number:'23%', label: "Of orders have mistakes", desc: 'Miscommunication costs revenue', icon: ''},
    {id:3, number:'40%', label: "Staff time wasted", desc: 'On walking orders back and forth', icon: ''},
    {id:4, number:'$800+', label: "Annual menu printing", desc: 'Per location wasted on outdated menus', icon: ''},
    {id:5, number:'3x', label: "Slower service at peak hours", desc: 'Staff overwhelmed, customers frustrated', icon: ''},
    {id:6, number:'68%', label: "Customers won't return", desc: 'After a single bad service experience', icon: ''},
]

export const Problem = () => {
  return (
    <section className="bg-[#111110] px-4 py-12 md:p-16">
        <SmallHeader  color="#68A544" text="THE PROBLEM"/>
        <Header text="Old Ordering Systems Are Costing You" color="#F7F7F7" />
        <DescHeader text="Manual order-taking bottlenecks frustrate customers and overload your team — every single day." color="#F0F0F0" />   

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-desktop mx-auto mt-10 md:mt-16">
            {problems.map(p => (
                <div key={p.id} className="bg-[#333330] p-6 rounded-2xl flex gap-3">
                    <div className="bg-[#FF6F61] w-10 h-10 rounded-lg shrink-0"></div>
                    <div className="grid gap-1">
                        <p className="text-3xl font-bold text-[#F67D26]">{p.number}</p>
                        <p className="font-medium text-sm text-[#F7F7F7]">{p.label}</p>
                        <p className="text-xs text-[#6B6B6B]">{p.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}