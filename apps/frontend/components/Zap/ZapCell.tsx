import React, { useState } from 'react'

interface ZapCell  {
    type?: string;
    name?: string;
    index: number
}

const ZapCell = ({type, name, index}:ZapCell) => {
    
  return (
    <div className='px-4 py-8 flex justify-center items-center border border-black rounded-lg w-[400px]'>
        <span className='font-bold'>{index}.</span>
        <span className='text-lg'>{name}</span>
    </div>
  )
}

export default ZapCell