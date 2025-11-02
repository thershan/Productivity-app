
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-gray-900/40 backdrop-blur-lg
        border border-gray-700/50 rounded-xl
        p-6 shadow-2xl shadow-black/30
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
