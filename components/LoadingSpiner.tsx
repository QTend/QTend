import React from 'react'

export const LoadingSpiner = () => {
  return (
    // Centers the spinner nicely within its container
    <div className="flex items-center justify-center w-full h-full min-h-40">
      
      <div className="relative flex items-center justify-center">
        {/* Outer Spinner (Bigger) */}
        <div className="w-16 h-16 border-4 border-[#F67D2680] border-t-transparent border-solid rounded-full animate-spin"></div>
        
        {/* Inner Spinner (Smaller, different color, spinning backwards) */}
        <div className="absolute w-8 h-8 border-4 border-[#68A54480] border-b-transparent border-solid rounded-full animate-[spin_1s_linear_infinite_reverse]"></div>
      </div>
      
    </div>
  )
}