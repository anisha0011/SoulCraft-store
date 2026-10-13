import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToastStore } from '../../store/useToastStore';
import type { ToastType } from '../../store/useToastStore';

const iconMap: Record<ToastType, React.ReactElement> = {
  success: <CheckCircle2 className="w-5 h-5 text-[#4F9D69]" />,
  error: <XCircle className="w-5 h-5 text-[#D9536F]" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const bgMap: Record<ToastType, string> = {
  success: 'border-l-[#4F9D69]',
  error: 'border-l-[#D9536F]',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onClose: () => void;
}

function ToastItem({ type, title, message, onClose }: ToastItemProps) {
  useEffect(() => {
    // Auto-close is handled by the store; this is just for animation purposes
  }, []);

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 bg-white border border-[#F0DDE4] border-l-4 ${bgMap[type]} rounded-2xl shadow-xl p-4 w-80 animate-slide-in`}
      style={{ animation: 'slideInRight 0.3s ease-out' }}
    >
      <div className="shrink-0 mt-0.5">{iconMap[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#3A2930]">{title}</p>
        {message && <p className="text-xs text-[#806B73] mt-0.5">{message}</p>}
      </div>
      <button
        onClick={onClose}
        className="shrink-0 text-[#806B73] hover:text-[#3A2930] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
