"use client";

import { ToasTProvider } from "@/context/ToastContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToasTProvider>
      <SessionProvider>
        {children}
      </SessionProvider>
    </ToasTProvider>
  );
}
