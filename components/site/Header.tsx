




export const Header = ({text, color, left}: {text: string, color?: string, left?: boolean}) => {
  return (
    <h2 className="font-bold text-4xl my-2"
    style={{color: color || '#1D1D1F', textAlign: left ? 'left' : 'center'}}
    >{text}</h2>

  )
}
