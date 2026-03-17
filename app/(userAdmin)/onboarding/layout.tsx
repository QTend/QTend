import Image from "next/image";

export default function onboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 1. Make the section a relative container with a minimum height
    <section className="relative min-h-screen w-full">
      <Image
        src="/onboardingBackground.png"
        alt="background image"
        fill
        className="object-cover -z-10"
        priority
      />
      {/* 3. Wrap children in a relative div if they need specific positioning */}
      <main className="relative z-0">
        {children}
      </main>
    </section>
  );
}
