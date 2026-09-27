'use client'
import { BranchProps } from "@/types/BranchType"
import { Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiShoppingBag } from "react-icons/fi"
import { IoMenuOutline } from "react-icons/io5"

const navs = [
    {label: 'Menu', icon: <IoMenuOutline size={22} />, title: 'Your Menu'},
    {label: 'Orders', icon: <FiShoppingBag size={22} />, title: 'Orders'},
    {label: 'Settings', icon: <Settings size={22} />, title: 'Settings'},
]

export function Navbar({branch}: {branch : BranchProps}){
    const pathname = usePathname()

    const currentNav = navs.find(n => 
        pathname.startsWith(`/dashboard/${branch.slug}/${n.label.toLowerCase()}`)
    )
    
    const displayTitle = currentNav ? currentNav.title : 'Dashboard'

    return(
        <div className="w-full fixed bottom-0 left-0 z-50 bg-white border-t border-gray-200 md:relative md:border-none md:bg-transparent pb-safe md:pb-0">
            <nav className="flex max-w-7xl w-full md:justify-between items-center mx-auto md:px-4">
                
                {/* Desktop Title - Hidden on Mobile */}
                <div className="hidden md:block">
                    <h1 className="text-xl text-[#333333] font-medium">
                        {displayTitle}
                    </h1>
                </div>

                {/* Navigation Links - Bottom Tabs on Mobile */}
                <div className="flex items-center justify-around w-full md:w-auto md:gap-5 px-2 py-2 md:p-0">
                    {navs.map((n, index) => {
                        const navBasePath = `/dashboard/${branch.slug}/${n.label.toLowerCase()}`;
                        const isActive = pathname.startsWith(navBasePath);

                        return (
                            <Link 
                                href={navBasePath} 
                                key={index} 
                                className={`flex flex-col md:flex-row items-center justify-center md:gap-2 rounded-xl md:border md:px-4 md:py-2 flex-1 md:flex-none cursor-pointer transition-all ${
                                    isActive 
                                        ? 'text-[#68A544] md:text-white md:bg-[#68A544] md:border-transparent' 
                                        : 'text-gray-400 md:text-black md:border-black/10 hover:bg-black/5'
                                }`}
                            >
                                <span className={`mb-1 md:mb-0 transition-transform ${isActive ? 'scale-110 md:scale-100' : ''}`}>
                                    {n.icon}
                                </span>
                                <p className={`text-[10px] md:text-sm md:font-medium ${isActive ? 'font-bold' : 'font-medium'}`}>
                                    {n.label}
                                </p>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}