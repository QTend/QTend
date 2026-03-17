import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "gradient" | "outline";
  className?: string; // Added to allow custom flex or width
}

export function GradientButton({ 
  label, 
  onClick, 
  type = "button", 
  variant = "gradient",
  className = "" 
}: ButtonProps) {
  
  const baseStyles = "p-3 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-all";
  
  const variantStyles = variant === "gradient" 
    ? "bg-gradient-to-r from-[#F67D26] to-[#68A544] text-white border-transparent" 
    : "bg-white text-black border border-gray-200 hover:bg-gray-50";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {label}
    </button>
  );
}
