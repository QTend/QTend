import React from 'react'

export const SmallHeader = ({text, color, left}: {text: string, color: string, left?: boolean}) => {
  return (
    <p 
    className="text-sm font-medium"
    style={{color, textAlign: left ? 'left' : 'center'}}
    >{text}</p>
  )
}