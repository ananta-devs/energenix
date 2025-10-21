// components/ui/Toast.jsx (NEW - extract from LoginPage)
import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: { icon: CheckCircle, bg: 'bg-green-500', text: 'text-white' },
    error: { icon: XCircle, bg: 'bg-red-500', text: 'text-white' },
    info: { icon: CheckCircle, bg: 'bg-blue-500', text: 'text-white' }
  };

  const { icon: Icon, bg, text } = config[type];

  return (
    <div className={`fixed top-4 right-4 ${bg} ${text} px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50 max-w-md`}>
      <Icon size={20} />
      <span className="font-medium flex-1">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80 transition">
        <X size={16} />
      </button>
    </div>
  );
};