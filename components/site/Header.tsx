




export const Header = ({text, color}: {text: string, color?: string}) => {
  return (
    <h2 className="font-bold text-4xl text-center my-2"
    style={{color: color || '#1D1D1F'}}
    >{text}</h2>

  )
}
