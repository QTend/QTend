'use client'
import { MouseEventHandler } from "react";

interface SwitchProps {
  enabled: boolean;
  // Use the name you want to call inside the component
  onClick: MouseEventHandler<HTMLButtonElement>; 
}

export default function Switch({ enabled, onClick }: SwitchProps) {
  return (
    <button
      type="button" // Good practice to prevent form submission
      onClick={onClick}
      className={`w-9 h-5 flex items-center rounded-full p-1 transition ${
        enabled ? "bg-[#F97316]" : "bg-gray-300"
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
