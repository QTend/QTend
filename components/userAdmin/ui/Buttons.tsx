'use client'

import React, { ReactNode } from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "gradient" | "outline";
  className?: string; 
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean; // Made this optional since you default it to false
}

export function GradientButton({ 
  label, 
  onClick, 
  type = "button", 
  variant = "gradient",
  className = "",
  icon,
  disabled = false,
  loading = false
}: ButtonProps) {
  
  // 1. Combine disabled and loading states so the button fades out if EITHER is true
  const isDisabled = disabled || loading;

  // 2. Added gap-2 for icon spacing and disabled:cursor-not-allowed
  const baseStyles = "p-3 gap-2 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-all disabled:cursor-not-allowed";
  
  const variantStyles = variant === "gradient" 
    ? isDisabled
      ? "bg-gradient-to-r from-[#F67D2680] to-[#68A54480] text-white"
      : "bg-gradient-to-r from-[#F67D26] to-[#68A544] text-white"
    : isDisabled
      ? "bg-gray-100 text-gray-400 border border-gray-200"
      : "bg-white text-black border border-gray-200";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {/* 3. Handle the loading text vs icon/label properly */}
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  );
}

export function PlainButton({ 
  label, 
  onClick, 
  type = "button", 
  className = "",
  icon,
  disabled = false,
  loading = false
}: ButtonProps) {
  
  const isDisabled = disabled || loading;
  
  // Added gap-2, cursor handling, and a default opacity fade for disabled plain buttons
  const baseStyles = "p-3 gap-2 rounded-xl flex items-center justify-center cursor-pointer font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60";

  return(
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${className}`}
    >
      {/* 4. Wrapped the false condition in a React Fragment `<></>` */}
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          {icon}
          {label}
        </>
      )}
    </button>
  )
}