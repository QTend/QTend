import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getCurrentBranch } from '@/lib/get-current-branch';
import { MenuItemProvider } from '@/context/MenuItemContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { Navbar } from '@/components/userAdmin/ui/layouts/Navbar'; // Assuming this import
import { Header } from "@/components/userAdmin/ui/layouts/Haeder";
import { UserAdminProvider } from "@/context/UserAdminContext";
import GlobalOrderListener from "@/context/GlobalOrderListener";

export default async function UserAdminDashboardLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{branchSlug: string}>
}>) {
  const { branchSlug } = await params; 
  const session: any = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/sign-in');
  }

  const branch = await getCurrentBranch(branchSlug)

  return (
    <UserAdminProvider branch={branch}>
    <CategoryProvider branch={branch}>
        <MenuItemProvider branch={branch}>
          
        <GlobalOrderListener />
          <div className=' min-h-screen flex flex-col gap-8'>
            <Navbar branch={branch} />
            <div className='max-w-7xl mx-auto flex-1 w-full pb-10'>
              {children} 
            </div> 
          </div> 
        </MenuItemProvider>
    </CategoryProvider>
    </UserAdminProvider>
  );
}