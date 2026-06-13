import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  disabled = false,
  fullWidth = false,
  icon = null
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold py-2.5 px-5 rounded-xl shadow-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-amazon-orange text-white hover:bg-amazon-orange-hover',
    secondary: 'bg-relife-green text-white hover:bg-relife-green-hover shadow-md',
    outline: 'bg-white text-amazon-blue border-2 border-gray-200 hover:border-amazon-light-blue hover:bg-gray-50',
    ghost: 'bg-transparent text-amazon-light-blue shadow-none hover:bg-gray-100 hover:text-amazon-blue',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
