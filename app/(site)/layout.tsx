import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";
import { ToasTProvider } from "@/context/ToastContext";
import { SessionProvider } from "next-auth/react";
import { Providers } from "../providers";


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
  metadataBase: new URL("https://getqtend.com"),
  
  // The %s allows child pages to inject their own title (e.g. "Menu | Qtend")
  title: {
    default: "Qtend | Smart QR Menus & Kitchen Management System",
    template: "%s | Qtend",
  },
  
  description: "Streamline your kitchen operations with Qtend. Experience seamless contactless QR ordering, real-time kitchen displays, and smart digital menus built for modern dining.",
  
  applicationName: "Qtend",
  authors: [{ name: "Qtend Team", url: "https://getqtend.com" }],
  generator: "Next.js",
  
  keywords: [
    "Qtend",
    "QR code",
    "QR code menu",
    "digital menu",
    "QR code ordering",
    "restaurant management software",
    "kitchen display system",
    "KDS",
    "contactless dining",
    "restaurant POS system",
    "smart restaurant operations"
  ],
  
  // OpenGraph powers the rich previews on iMessage, WhatsApp, Facebook, LinkedIn, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://getqtend.com",
    siteName: "Qtend",
    title: "Qtend | Smart QR Menus & Kitchen Management System",
    description: "Transform your restaurant with seamless contactless ordering and real-time kitchen displays.",
    images: [
      {
        url: "/og-image.jpg", // Create a 1200x630px image and put it in your /public folder
        width: 1200,
        height: 630,
        alt: "Qtend Restaurant Management Dashboard Preview",
      },
    ],
  },
  
  // Twitter cards power the rich previews on X / Twitter
  twitter: {
    card: "summary_large_image",
    title: "Qtend | Smart QR Menus & Kitchen Management",
    description: "Transform your restaurant with seamless contactless ordering and real-time kitchen displays.",
    images: ["/og-image.jpg"],
    creator: "@QtendApp", // Replace with your actual Twitter handle if you have one
  },
  
  // Tells Google to actively index your marketing pages and follow the links
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={` ${spaceGrotesk.variable} antialiased scroll-auto`}
      >
        <Providers>
          <main>
            {children}
          </main>
        </Providers>
            
      </body>
    </html>
  );
}
