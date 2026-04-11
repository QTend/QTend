'use client'

import { ChartColumn, Settings } from "lucide-react"
import { SuffixPathnameNormalizer } from "next/dist/server/normalizers/request/suffix"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiShoppingBag } from "react-icons/fi"
import { IoMenuOutline } from "react-icons/io5"

const navs = [
    {label: 'Menu', icon: <IoMenuOutline />},
    {label: 'Orders', icon: <FiShoppingBag />},
    {label: 'Analytics', icon: <ChartColumn />},
    {label: 'Settings', icon: <Settings />},
]

export function Navbar(){
    const pathname = usePathname()
    const activeSegment = pathname.split('/').pop() 


    const renderMenuTitle = () => {
        const title = navs.find(n => n.label.toLocaleLowerCase() === activeSegment)?.label
        return(
            <div>
                <p className="text-[#333333] text-xl">{title}</p>
                {/* <div>
                    {}
                </div> */}
            </div>
        )
    }

    return(
        <nav className="flex max-w-7xl justify-between mx-auto mt-10 mb-5">
            <div>
                <div className="text-[#333333] text-xl">{renderMenuTitle()}</div>
            </div>
            
            <div className="flex justify-between items-center gap-5">
            {navs.map((n, index) => (
                <Link href={`/dashboard/1/${n.label.toLowerCase()}`} key={index} className={`flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 cursor-pointer ${activeSegment === n.label.toLowerCase() ? 'text-white bg-[#68A544]' : 'text-black'}`}>
                    <div>{n.icon}</div>
                    <p>{n.label}</p>
                </Link>
            ))}
            </div>
        </nav>
    )
}