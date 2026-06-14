

import React from 'react'

export const DescHeader = ({text, color}: {text: string, color?: string}) => {
  return (
    <p 
    className="text-center text-lg text-[#F0F0F0] max-w-[620] mx-auto"
    style={{color: color || '#6B6B6B'}}
    >{text}</p> 
  )
}
