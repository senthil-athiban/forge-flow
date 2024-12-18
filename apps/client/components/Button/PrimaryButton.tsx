'use client';
import React, { ReactNode } from 'react'

interface PrimaryButtonProps {
    onClick : () => void;
    children: ReactNode,
    size?: "sm" | "lg",
    disabled?: boolean,
    className?: any;
}
const PrimaryButton = ({children, size = "sm", onClick, disabled, className}: PrimaryButtonProps) => {
  return (
    <button disabled={disabled} className={`bg-[#ff4f00] ${className} hover:bg-orange-500 p-2 rounded-3xl cursor-pointer px-4 text-white ${size === "lg" && "size-max"}`} onClick={onClick}>
        {children}
    </button>
  )
}

export default PrimaryButton