import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({ 
  children, 
  loading, 
  variant = 'primary',
  ...props 
}) => {
  const baseStyles = "w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
    secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
    outline: "border border-purple-600 text-purple-600 hover:bg-purple-50"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]}`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 size={20} className="animate-spin" />}
      {children}
    </button>
  );
};