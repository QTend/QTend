import { Activity, ChartNoAxesColumn, ChefHat, FileText, MonitorSmartphone, PanelsTopLeft, QrCode, Shield, Table, ToggleLeft } from "lucide-react"
import { Header } from "../Header"
import { SmallHeader } from "../SmallHeader"

const features = [
    {id:1, icon: QrCode, label: 'QR Ordering', desc: 'Table-specific QR codes for instant, no-app ordering.'},
    {id:2, icon: PanelsTopLeft, label: 'Digital Menus', desc: 'Beautiful photo menus with real-time updates.'},
    {id:3, icon: Activity, label: 'Live Order Management', desc: 'Orders land instantly on your dashboard as placed.'},
    {id:4, icon: ChefHat, label: 'Kitchen Workflow', desc: 'Kitchen display system for seamless prep flow.'},
    {id:5, icon: Table, label: 'Table Management', desc: 'Visual floor plan with active table monitoring.'},
    {id:6, icon: Shield, label: 'Staff Permissions', desc: 'Role-based access for managers, staff, and kitchen.'},
    {id:7, icon: ChartNoAxesColumn, label: 'Analytics Dashboard', desc: 'Sales, peak times, bestsellers — all in one view.'},
    {id:8, icon: ToggleLeft, label: 'Menu Availability', desc: 'Pause items instantly when you run out of stock.'},
    {id:9, icon: MonitorSmartphone, label: 'Multi-device Access', desc: 'Works on phones, tablets, laptops — anything.'},
    {id:10, icon: FileText, label: 'Reporting', desc: 'Daily, weekly, monthly reports with export options.'},
]

export const Features = () => {
  return (
    <section className="px-4 py-12 md:p-16">
        <SmallHeader text="FEATURES" color="#F67D26" />
        <Header text='Everything You Need to Run a Modern Kitchen' />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-3 mt-10 md:mt-16 max-w-desktop mx-auto">
            {features.map(f => {
                const IconComponent = f.icon

                return(
                    <div key={f.id} className="bg-[#F7F7F7] rounded-2xl p-5 h-full">
                        <div className="w-10 h-10 bg-[#FFFFFF] flex justify-center items-center border border-[#E8E8E8] rounded-full mb-4">
                            <IconComponent color='#0E8A54' className="w-5 h-5" />
                        </div>
                        <p className="text-[#1D1D1F] font-bold text-sm mb-2">{f.label}</p>
                        <p className="text-[#6B6B6B] text-xs leading-relaxed">{f.desc}</p>
                    </div>
                )
            })}
        </div>

    </section>
  )
}