'use client'

import React, { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "gradient" | "outline";
  className?: string; // Added to allow custom flex or width
  icon?:ReactNode;
  disabled?: boolean;
}

export function GradientButton({ 
  label, 
  onClick, 
  type = "button", 
  variant = "gradient",
  className = "",
  icon,
  disabled = false
}: ButtonProps) {
  
  const baseStyles = "p-3 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-all";
  
  const variantStyles = variant === "gradient" 
  ? disabled
    ? "bg-gradient-to-r from-[#F67D2680] to-[#68A54480] text-white"
    : "bg-gradient-to-r from-[#F67D26] to-[#68A544] text-white"
  : "bg-white text-black border border-gray-200";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}


export function PlainButton({ 
  label, 
  onClick, 
  type = "button", 
  className = "",
  icon,
  disabled = false
}: ButtonProps) {
    const baseStyles = "p-3 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-all";

  return(
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${className}`}
    >
      {icon}
      {label}
    </button>
  )
}
