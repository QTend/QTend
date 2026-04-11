import '@/app/globals.css'
import { Header } from '@/components/userAdmin/ui/layouts/Haeder';
import { Navbar } from '@/components/userAdmin/ui/layouts/Navbar';import { cookies, headers } from "next/headers"; // Next.js 15 uses cookies() directly
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getCurrentBranch } from '@/lib/get-current-branch';

export default async function UserAdminDashboardLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{branchSlug: string}>
}>) {
  const {branchSlug} = await params; 

  // console.log('slug',branchSlug)

  const session: any = await getServerSession(authOptions)

 
  if (!session?.user?.id) {
    redirect('/auth/sign-in');
  }

 const branch = await getCurrentBranch(branchSlug)



  return (
    <div className=''>
      <Header branch={branch} />
      <Navbar/>
      <div className='max-w-7xl mx-auto p-4 pb-10'>
      {children} 
      </div> 
    </div> 
  );
}