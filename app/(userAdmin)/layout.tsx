import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import { ToasTProvider } from "@/context/ToastContext";



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
  title: "Qtend",
  description: "Hospitality business dashboard",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'QTend',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  }
};

export default function UserAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${spaceGrotesk.className} antialiased bg-[#f9741613]`}
      >
        <ToasTProvider>
          {children}
        </ToasTProvider>
      </body>
    </html>
  );
}
