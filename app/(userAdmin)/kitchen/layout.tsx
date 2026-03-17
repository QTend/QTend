import '@/app/globals.css'
import { Header } from '@/components/userAdmin/ui/layouts/Haeder';
import { Navbar } from '@/components/userAdmin/ui/layouts/Navbar';

export default function UserAdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=''>
      <Header />
      <Navbar/>
      <div className='max-w-7xl mx-auto p-4 pb-10'>
      {children} 
      </div> 
    </div> 
  );
}
