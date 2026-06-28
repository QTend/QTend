"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeInfo, DollarSign, Palette, QrCode, Settings, ShieldCheck } from "lucide-react";
import { BranchProps } from "@/types/BranchType";

// Added a 'path' property here so you can edit the link strings easily
const menus = [
  { id: 1, path: '', icon: Settings, label: 'General', desc: 'Restaurant info & preferences' },
  { id: 2, path: '/tables', icon: QrCode, label: 'Menu and tables', desc: 'Tables and QR options' },
  { id: 3, path: '/branding', icon: Palette, label: 'Branding', desc: 'Logo, colors & appearance' },
  // { id: 4, path: '/financial-settings', icon: DollarSign, label: 'Financial Settings', desc: 'Tax, VAT & payment options' },
  // { id: 5, path: '/roles-and-permissions', icon: ShieldCheck, label: 'Roles & Permissions', desc: 'Team access & security' },
  // { id: 6, path: '/danger-zone', icon: BadgeInfo, label: 'Danger Zone', desc: 'Destructive actions' },
];

export const SettingsSideBar = ({branch}: {branch :BranchProps}) => {
  // Grabs the current URL path to determine which link is active
  const pathname = usePathname(); 

  return (
    <div className="w-full max-w-[320px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {menus.map((menu) => {
        // Construct the full URL
        const href = `/dashboard/${branch.slug}/settings${menu.path}`;


        
        // Check if the current URL matches this link
        const isActive = pathname === href; 
        const isDanger = menu.label === 'Danger Zone';
        const Icon = menu.icon;

        return (
          <Link
            key={menu.id}
            href={href}
            className={`
              relative w-full flex items-center gap-4 p-4 text-left transition-colors duration-200
              border-b border-gray-100 last:border-none
              ${isActive ? 'bg-[#F0F7EB]' : 'bg-white hover:bg-gray-50'}
            `}
          >
            {/* Active Indicator Bar */}
            {isActive && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600" />
            )}

            {/* Icon */}
            <div 
              className={`mt-0.5 ${
                isActive 
                  ? 'text-green-600' 
                  : isDanger 
                    ? 'text-red-500' 
                    : 'text-slate-400'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            {/* Text Content */}
            <div className="flex flex-col">
              <span 
                className={`font-semibold text-sm text-[#222222] ${
                  isDanger ? 'text-red-500' : 'text-slate-800'
                }`}
              >
                {menu.label}
              </span>
              <span className="text-xs text-[#AAAAAA] mt-0.5">
                {menu.desc}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};