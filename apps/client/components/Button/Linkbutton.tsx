'use client';
import React, { ReactNode } from 'react'

interface LinkbuttonProps {
    onClick: () => void;
    children: ReactNode
}
const Linkbutton = ({
    onClick,
    children
}: LinkbuttonProps) => {
  return (
    <div className='p-2 hover:bg-slate-200 hover:rounded-lg text-md cursor-pointer' onClick={onClick}>
        {children}
    </div>
  )
}

export default Linkbutton