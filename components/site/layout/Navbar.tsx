import Link from "next/link"

const links = [
    {id:1, label: 'Product', link: '#product'},
    {id:2, label: 'Features', link: '#features'},
    {id:3, label: 'Pricing', link: '#pricing'},
    {id:4, label: 'Resources', link: '#resources'},
]

export const Navbar = () => {
  return (
    <nav>
        <div className="flex items-center justify-between max-w-desktop  p-4 mx-auto">
            <Link href={'/'}>Qtend</Link>
            <div className="flex items-center gap-5">
                {
                    links.map(l => (
                        <Link key={l.id} href={`/${l.link}`} className="text-sm font-medium text-[#1D1D1F]">{l.label}</Link>
                    ))
                }
            </div>
            <div className="flex items-center justify-between gap-4">
                <Link href={'/auth/sign-in'} className="font-medium text-sm rounded-lg py-2 px-2.5 ">Log in</Link>
                <Link href={'/auth/sign-in'} className="bg-[#F67D26] text-white font-medium text-sm rounded-lg py-2 px-2.5 ">
                  Get started
                 </Link>
            </div>
        </div>
    </nav>
  )
}
