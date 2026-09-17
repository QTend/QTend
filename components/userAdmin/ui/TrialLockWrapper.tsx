'use client'

import { usePathname, useRouter } from "next/navigation";
import { Rocket, Lock } from "lucide-react";
import { useEffect, useState } from "react";

export default function TrialLockWrapper({ 
    children, 
    initialIsExpired,
    expiryTimestamp,
    isTrial,
    branchSlug 
}: { 
    children: React.ReactNode;
    initialIsExpired: boolean;
    expiryTimestamp: number;
    isTrial: boolean;
    branchSlug: string;
}) {
    const pathname = usePathname();
    const router = useRouter();
    
    // 🚀 NEW: Store expiration in client state
    const [isExpired, setIsExpired] = useState(initialIsExpired);

    const isBillingPage = pathname.includes(`/billing`);

    // 🚀 NEW: Background timer that catches soft navigation
    useEffect(() => {
        // If they are not on a trial (e.g., they paid), no need to run the timer
        if (!isTrial) return;

        const checkExpiry = () => {
            if (Date.now() > expiryTimestamp) {
                setIsExpired(true);
            }
        };

        checkExpiry(); // Check immediately on mount
        const interval = setInterval(checkExpiry, 5000); // Check every 5 seconds

        return () => clearInterval(interval);
    }, [isTrial, expiryTimestamp]);

    // Manage scrolling lock
    useEffect(() => {
        if (isExpired && !isBillingPage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isExpired, isBillingPage]);

    if (!isExpired || isBillingPage) return <>{children}</>;

    return (
        <div className="relative w-full min-h-screen overflow-hidden bg-gray-50">
            {/* The Blurred Dashboard */}
            <div className="w-full h-screen blur-md pointer-events-none opacity-40 select-none overflow-hidden">
                {children}
            </div>

            {/* The Hard Paywall Overlay */}
            <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 border border-red-100">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#101828] mb-3">Trial Expired</h2>
                    <p className="text-[#475467] text-sm mb-6 leading-relaxed">
                        Your 14-day trial period has ended. To continue managing your menu, tracking analytics, and accessing your dashboard, please select a plan.
                    </p>
                    <button 
                        onClick={() => {
                            document.body.style.overflow = 'auto';
                            router.push(`/dashboard/${branchSlug}/billing`);
                        }}
                        className="w-full bg-[#F67D26] hover:bg-[#e0691c] text-white py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        <Rocket size={18} /> View Pricing Plans
                    </button>
                </div>
            </div>
        </div>
    );
}