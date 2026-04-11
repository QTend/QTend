import Image from "next/image";


export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 


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