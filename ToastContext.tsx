import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode, CSSProperties } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  duration?: number;
}

interface ToastContextProps {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

interface ToastState {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const generateToastId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, options: ToastOptions = {}) => {
    const { duration } = options;
    const randomId = generateToastId();
    const removeTimer = setTimeout(() => {
      removeToast(randomId);
    }, 5000);

    setToasts((prevToasts) => [{ message, type, id: randomId, duration }, ...prevToasts]);

    return () => {
      clearTimeout(removeTimer);
    };
  }, [removeToast]);

  const contextValue = useMemo(() => ({
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
  }), [addToast]);

  const containerStyles: CSSProperties = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    zIndex: 999,
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div style={containerStyles}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProps {
  id: string;
  message: string;
  type: ToastType
  duration?: number
}

const Toast = ({ message, type, duration = 5000 }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Just some basic styles to get you up and running
  const typeToColor = {
    'success': '#22c55e',
    'error': '#ef4444',
    'info': '#3b82f6'
  }

  const toastStyles: CSSProperties = {
    position: 'relative',
    zIndex: 999,
    padding: '1rem',
    borderRadius: '0.375rem',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: typeToColor[`${type}`],
    transition: 'all 300ms ease-in-out',
    transform: isVisible ? 'translateX(0px)' : 'translateX(calc(100% + 100px))'
  }

  useEffect(() => {
    setIsVisible(true);

    const slideTimer = setTimeout(() => {
      setIsVisible(false)
    }, duration / 1.5)

    return () => {
      clearTimeout(slideTimer)
    }
  }, [duration]);

  return (
    <div
      style={toastStyles}
      role="alert"
    >
      {message}
    </div>
  );
};