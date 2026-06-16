import Image from 'next/image'
import React from 'react'

const EmptyMenuItem = () => {
  return (
    <div className='max-w-xl text-center mx-auto pb-10'>
        <Image src={'/emptyMenu.png'} alt='meu empty image' width={92} height={56} className='w-64 h-auto mx-auto' priority />
        <p>You have no item created yet</p>
        <div className='text-white bg-[#F67D26] px-6 py-2 w-fit mx-auto rounded-xl mt-5'>Create Item Now</div>
    </div>
  )
}

export default EmptyMenuItem