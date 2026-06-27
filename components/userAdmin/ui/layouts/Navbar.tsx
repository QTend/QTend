'use client'
import { BranchProps } from "@/types/BranchType"
import { ChartColumn, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiShoppingBag } from "react-icons/fi"
import { IoMenuOutline } from "react-icons/io5"

const navs = [
    {label: 'Menu', icon: <IoMenuOutline />, title: 'Your Menu'},
    {label: 'Orders', icon: <FiShoppingBag />, title: 'Orders'},
    {label: 'Analytics', icon: <ChartColumn />, title: 'Analytics'},
    {label: 'Settings', icon: <Settings />, title: 'Settings'},
]

export function Navbar({branch}: {branch : BranchProps}){
    const pathname = usePathname()
    const activeSegment = pathname.split('/').pop()

    // Find the currently active navigation item to get its specific title
    const currentNav = navs.find(n => n.label.toLowerCase() === activeSegment)
    // Fallback to a default title if no match is found
    const displayTitle = currentNav ? currentNav.title : 'Dashboard'

    return(
        <div className="w-full">
            <nav className="flex max-w-7xl w-full justify-between items-center mx-auto px-4">
                {/* Left Side: Dynamic Navbar Title */}
                <div>
                    <h1 className="text-xl text-[#333333]">
                        {displayTitle}
                    </h1>
                </div>

                {/* Right Side: Navigation Links */}
                <div className="flex items-center gap-5">
                    {navs.map((n, index) => (
                        <Link 
                            href={`/dashboard/${branch.slug}/${n.label.toLowerCase()}`} 
                            key={index} 
                            className={`flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 cursor-pointer transition-colors ${
                                activeSegment === n.label.toLowerCase() 
                                    ? 'text-white bg-[#68A544] border-transparent' 
                                    : 'text-black hover:bg-black/5'
                            }`}
                        >
                            <span className="text-xl">{n.icon}</span>
                            <p className="font-medium text-sm">{n.label}</p>
                        </Link>
                    ))}
                </div>
            </nav>
        </div>
    )
}
