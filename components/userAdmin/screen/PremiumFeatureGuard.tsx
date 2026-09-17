'use client'

import { useUserAdmin } from "@/context/UserAdminContext";
import { Rocket, Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PremiumFeatureGuardProps {
    children: React.ReactNode;
    requiredPlan: 'starter' | 'pro';
    featureName: string;
    description: string;
    benefits: string[];
}

export default function PremiumFeatureGuard({ 
    children, 
    requiredPlan, 
    featureName, 
    description,
    benefits 
}: PremiumFeatureGuardProps) {
    const { branch } = useUserAdmin();
    const router = useRouter();

    const currentPlan = branch?.plans?.planType || 'basic';

    // Logic: If they need Pro, only Pro works. If they need Starter, Starter OR Pro works.
    const isAuthorized = 
        currentPlan === 'pro' || 
        (requiredPlan === 'starter' && currentPlan === 'starter');

    // If they have the right plan, render the actual page
    if (isAuthorized) return <>{children}</>;

    // Dynamic text formatting for the upsell
    const planDisplayName = requiredPlan === 'starter' ? 'Starter or Pro' : 'Pro';
    const planPlurality = requiredPlan === 'starter' ? 'Plans' : 'Plan';

    // If they are on Basic, render the Upsell Paywall
    return (
        <div className="w-full min-h-[70vh] flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                
                {/* Visual Header */}
                <div className="bg-linear-to-br from-gray-900 to-[#101828] p-10 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#F67D26] opacity-20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-[#68A544] opacity-20 rounded-full blur-2xl"></div>
                    
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 border border-white/20">
                        <Lock size={32} className="text-[#F67D26]" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                        {featureName}
                    </h2>
                    <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Benefits & CTA */}
                <div className="p-8 bg-white">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                        Included in the {planDisplayName} {planPlurality}
                    </p>
                    
                    <div className="flex flex-col gap-3 mb-8">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <CheckCircle2 size={20} className="text-[#68A544] shrink-0 mt-0.5" />
                                <span className="text-sm text-[#344054] font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => router.push(`/dashboard/${branch?.slug}/billing`)}
                        className="w-full bg-[#F67D26] hover:bg-[#e0691c] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                        <Rocket size={18} /> Upgrade to {planDisplayName}
                    </button>
                    <button 
                        onClick={() => router.back()}
                        className="w-full mt-3 py-3 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}