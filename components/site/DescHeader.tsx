

import React from 'react'

export const DescHeader = ({text, color, left}: {text: string, color?: string, left?: boolean}) => {
  return (
    <p 
    className=" text-lg text-[#F0F0F0] max-w-[620]"
    style={{color: color || '#6B6B6B', textAlign: left ? 'left' : 'center', marginInline: left ? '' : 'auto'}}
    >{text}</p> 
  )
}
