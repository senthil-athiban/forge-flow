'use client';
import React, { ReactNode } from 'react'

interface SecondaryButtonProps {
    onClick : () => void;
    children: ReactNode,
    size?: "sm" | "lg"
}
const SecondaryButton = ({children, size = "sm", onClick}: SecondaryButtonProps) => {
  return (
    <div className={`hover:bg-slate-300 p-2 rounded-3xl cursor-pointer px-4 text-black border-black border-b ${size === "lg" && "size-max"}`} onClick={onClick}>
        {children}
    </div>
  )
}

export default SecondaryButton