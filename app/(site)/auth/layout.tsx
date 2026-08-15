import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { redirect } from "next/navigation";


export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 
 const session: any = await getServerSession(authOptions)

  if (session?.user?.id) {
    redirect('/dashboard-redirect');
  }

  return (
    <section className="relative min-h-screen w-full">
      <Image
        src="/onboardingBackground.png"
        alt="background image"
        fill
        className="object-cover -z-10"
        priority
      />
      <main className="relative z-0">
        {children}
      </main>
    </section>
  );
}