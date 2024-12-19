import React, { ReactNode } from "react";

interface ProviderButtonProps {
  icon?: any;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
const ProviderButton = ({ icon, children, className, onClick }: ProviderButtonProps) => {
  return (
    <button className={`flex gap-x-3 w-full px-4 py-2 items-center ${className}`} onClick={onClick}>
      <div className="bg-white flex-grow-0 p-2 rounded-md">
        {icon}
      </div>
      <span className="text-center font-bold text-white flex-grow">{children}</span>
    </button>
  );
};

export default ProviderButton;
