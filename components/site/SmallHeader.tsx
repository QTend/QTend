



import React from 'react'

export const SmallHeader = ({text, color}: {text: string, color: string}) => {
  return (
    <p 
    className="text-sm font-medium text-center"
    style={{color}}
    >{text}</p>
  )
}
