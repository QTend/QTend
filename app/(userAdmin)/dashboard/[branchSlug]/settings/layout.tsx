import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import { getCurrentBranch } from '@/lib/get-current-branch';
import { SettingsSideBar } from "@/components/userAdmin/ui/layouts/SettingsSideBar";

export default async function UserAdminSettingsLayout({
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
    <div className="flex flex-col lg:flex-row gap-8 mt-8 max-w-7xl mx-auto w-full px-4 lg:px-8">
      
      <div className="w-full lg:w-[320px] shrink-0">
        <div className="sticky top-8">
          <SettingsSideBar branch={branch} />
        </div>
      </div>

      <div className="flex-1 min-w-0 pb-20">
        {children} 
      </div> 
      
    </div> 
  );
}