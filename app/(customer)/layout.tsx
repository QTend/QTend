import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@/app/globals.css'
import { CartProvider } from "@/context/CartContext";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F97316",
};

export const metadata: Metadata = {
  title: "Qtend | Smart QR Menus & Kitchen Management System",
};

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    

  return (
    <html lang="en">
      <body
         className={`${spaceGrotesk.variable} ${spaceGrotesk.className} antialiased bg-[#f9741613]`}
      >
          <CartProvider>
            {children}
          </CartProvider>
        
        
      </body>
    </html>
  );
}
