import React from 'react';
import { useCampusBite } from '../../context/CampusBiteContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCampusBite();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm transition-all animate-in fade-in slide-in-from-bottom-2 ${
              isSuccess 
                ? 'bg-white border-[#16A36A]/30 text-[#242424]' 
                : isError
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : isWarning
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-white border-orange-200 text-[#242424]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-4 h-4 text-[#F07832] shrink-0" />}
              <span className="font-medium text-xs sm:text-sm">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
