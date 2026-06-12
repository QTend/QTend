
import { Navbar } from "@/components/site/layout/Navbar";





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main>
        <Navbar />
        {children}
      </main>
    </>
  );
}
