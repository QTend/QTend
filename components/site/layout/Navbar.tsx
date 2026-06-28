"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

const links = [
    {id:1, label: 'Product', link: '#product'},
    {id:2, label: 'Features', link: '#features'},
    {id:3, label: 'Pricing', link: '#pricing'},
    {id:4, label: 'Resources', link: '#resources'},
]

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Destructure 'data' as session and pull authentication loading status
  const { data: session, status } = useSession();

  console.log('session', session)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Optional: Prevent buttons flashing layout transitions during auth loading phases
  const isLoading = status === "loading";

  return (
    <nav className="sticky top-0 z-50 bg-white">
        <div className="flex items-center justify-between max-w-desktop p-4 mx-auto">
            {/* Logo */}
            <Link href={'/'} className="font-bold text-[#1D1D1F]">
              <Image src={'/logo.png'} width={741} height={321} alt="qtend logo" className="object-cover w-24 h-auto" />
            </Link>
            
            {/* Desktop Navigation - FIXED: Native page hashes */}
            <div className="hidden md:flex items-center gap-5">
                {
                    links.map(l => (
                        <Link key={l.id} href={l.link} className="text-sm font-medium text-[#1D1D1F] hover:opacity-80 transition-opacity">
                            {l.label}
                        </Link>
                    ))
                }
            </div>
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center justify-between gap-4">
                {!isLoading && (
                    session?.user?.slug ? (
                        <Link href={`/dashboard/${session?.user?.slug}/menu`} className="bg-[#F67D26] text-white font-medium text-sm rounded-lg py-2 px-4 hover:bg-[#e06d1e] transition-colors">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href={'/auth/sign-in'} className="font-medium text-sm rounded-lg py-2 px-2.5 text-[#1D1D1F] hover:bg-gray-50 transition-colors">
                                Log in
                            </Link>
                            <Link href={'/auth/sign-up'} className="bg-[#F67D26] text-white font-medium text-sm rounded-lg py-2 px-2.5 hover:bg-[#e06d1e] transition-colors">
                                Get started
                            </Link>
                        </>
                    )
                )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden flex items-center">
                <button 
                    onClick={toggleMenu} 
                    className="text-[#1D1D1F] focus:outline-none p-2"
                    aria-label="Toggle menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-lg z-50">
                <div className="flex flex-col px-4 pt-2 pb-6 space-y-4">
                    <div className="flex flex-col space-y-3 pt-2">
                        {
                            links.map(l => (
                                <Link 
                                    key={l.id} 
                                    href={l.link} 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-sm font-medium text-[#1D1D1F] py-2 border-b border-gray-50"
                                >
                                    {l.label}
                                </Link>
                            ))
                        }
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-2">
                        {!isLoading && (
                            session?.user?.slug ? (
                                <Link 
                                    href={`/dashboard/${session?.user?.slug}/menu`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="bg-[#F67D26] text-white font-medium text-sm rounded-lg py-2.5 px-4 text-center"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link 
                                        href={'/auth/sign-in'} 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="font-medium text-sm rounded-lg py-2.5 px-4 text-center border border-gray-200 text-[#1D1D1F]"
                                    >
                                        Log in
                                    </Link>
                                    <Link 
                                        href={'/auth/sign-up'} 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="bg-[#F67D26] text-white font-medium text-sm rounded-lg py-2.5 px-4 text-center"
                                    >
                                        Get started
                                    </Link>
                                </>
                            )
                        )}
                    </div>
                </div>
            </div>
        )}
    </nav>
  )
}
