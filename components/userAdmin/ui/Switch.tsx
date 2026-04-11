'use client'
import { MouseEventHandler } from "react";

interface SwitchProps {
  enabled: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  bgOn?: string;
  bgOff?: string;
}

export default function Switch({ 
  enabled, 
  onClick, 
  bgOn = "bg-[#F97316]",
  bgOff = "bg-gray-300"  
}: SwitchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-5 flex items-center rounded-full p-1 transition ${
        enabled ? bgOn : bgOff
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
          enabled ? "translate-x-4" : "-translate-x-1"
        }`}
      />
    </button>
  );
}
