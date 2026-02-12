import React, { useEffect } from "react";

const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-slide-in">
      <div className="bg-surface-dark border border-brand-red/50 text-white px-6 py-4 rounded shadow-2xl flex items-center gap-4">
        <div className="w-8 h-8 bg-brand-red rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-sm font-bold">
            check
          </span>
        </div>
        <div>
          <h4 className="font-bold text-sm uppercase italic tracking-wider">
            Success
          </h4>
          <p className="text-white/70 text-xs">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 hover:text-brand-red transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  );
};

export default Toast;
