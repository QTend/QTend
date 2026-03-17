type Button = {
    onClick?: any;
    bg: string;
    text: string;
    borderColor?: string;
    color?: string;
    disabled?: boolean
}


const Button = ({onClick, bg, text, borderColor='transparent', color='#fff', disabled}:Button) => {
  return (
    <button
        onClick={onClick}
        className={` p-3 rounded-xl w-full flex items-center justify-center mx-auto cursor-pointer`}
        style={{ backgroundColor: bg, borderColor: borderColor, borderWidth:1, color:color }}
        disabled={disabled}
        >
        <p>{text}</p>
    </button>
  )
}

export default Button