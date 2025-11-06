
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'lg',
  children,
  className = '',
  ...props
}) => {
  const baseClasses =
    'w-full font-bold rounded-xl shadow-md transition-all duration-200 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FFFBF5]';

  const sizeClasses = {
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-lg',
  };

  const variantClasses = {
    primary: 'bg-[#F9A826] hover:bg-[#F9B44B] text-white shadow-orange-200 focus:ring-orange-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-gray-200 focus:ring-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-red-200 focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
