import { Zap, Smartphone, QrCode, Activity, Wifi } from 'lucide-react'

const briefs = [
    // 1. Pass the component reference directly, not a string
    { id: 1, lebel: 'Setup in minutes', icon: Zap },
    { id: 2, lebel: 'No app download required', icon: Smartphone }, 
    { id: 3, lebel: 'Unlimited QR tables', icon: QrCode }, 
    { id: 4, lebel: 'Real-time order management', icon: Activity },
    { id: 5, lebel: 'Works on any smartphone', icon: Wifi }
]

export const Brief = () => {
  return (
    <div className="bg-white py-6 md:py-8 w-full border-b border-gray-50">
        <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-4 md:gap-x-6 max-w-7xl mx-auto px-4">
            {briefs.map(b => {
                const IconComponent = b.icon;

                return (
                    <div key={b.id} className="flex items-center gap-2">
                        {/* 3. Render it safely like a standard component */}
                        <IconComponent className="text-[#0E8A54] w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        <p className="text-[#6B6B6B] text-sm font-medium whitespace-nowrap">
                            {b.lebel}
                        </p>
                    </div>
                );
            })}
        </div>
    </div>
  )
}