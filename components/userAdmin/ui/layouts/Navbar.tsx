'use client'

import { BranchProps } from "@/types/BranchType"
import { ChartColumn, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiShoppingBag } from "react-icons/fi"
import { IoMenuOutline } from "react-icons/io5"

const navs = [
    {label: 'Menu', icon: <IoMenuOutline />, title: 'Your Menu'},
    {label: 'Orders', icon: <FiShoppingBag />, title: 'Your Menu'},
    {label: 'Analytics', icon: <ChartColumn />, title: 'Your Menu'},
    {label: 'Settings', icon: <Settings />, title: 'Your Menu'},
]

export function Navbar({branch}: {branch : BranchProps}){
    console.log('navbar', branch)
    const pathname = usePathname()
    const activeSegment = pathname.split('/').pop() 


    return(
        <div className=" bg-white py-5">
             <nav className=" flex max-w-7xl justify-between mx-auto mb-5">
                <div>
                    <p className="text-2xl font-medium text-[#333333]">{branch.name}</p>
                    <p className="text-[#666666] text-sm">{branch.location.address}</p>
                </div>
                
                <div className="flex justify-between items-center gap-5">
                {navs.map((n, index) => (
                    <Link href={`/dashboard/${branch.slug}/${n.label.toLowerCase()}`} key={index} className={`flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 cursor-pointer ${activeSegment === n.label.toLowerCase() ? 'text-white bg-[#68A544]' : 'text-black'}`}>
                        <div>{n.icon}</div>
                        <p>{n.label}</p>
                    </Link>
                ))}
                </div>
            </nav>
        </div>
       
    )
}