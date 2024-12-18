'use client';
import React, { ReactNode } from 'react'

interface ZapButtonProps {
    onClick : () => void;
    children: ReactNode,
    size?: "sm" | "lg",
    disabled?: boolean
}
const ZapButton = ({children, size = "sm", onClick, disabled}: ZapButtonProps) => {
  return (
    <button disabled={disabled} className={`bg-[#7f27e5] hover:bg-purple-300 p-2 rounded cursor-pointer px-4 text-white ${size === "lg" && "size-max"}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default ZapButton