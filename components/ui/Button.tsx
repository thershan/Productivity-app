
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({ children, size = 'md', ...props }) => {
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';
  
  return (
    <button
      className={`
        relative inline-flex items-center justify-center font-semibold text-white transition-all duration-300
        bg-cyan-500/10 border border-cyan-400/50 rounded-md
        hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(0,229,255,0.5)]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${sizeClasses}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
