import { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useMemo, 
  useEffect, 
  ReactNode, 
  CSSProperties 
} from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warn';

interface ToastOptions {
  duration?: number;
}

interface ToastContextProps {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  warn: (message: string, options?: ToastOptions) => void;
}

interface ToastState {
  id: string;
  message: string;
  type: ToastType;
  options?: ToastOptions;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const generateToastId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, options: ToastOptions = {}) => {
    const { duration = 5000 } = options;
    const randomId = generateToastId();
    const removeTimer = setTimeout(() => {
      removeToast(randomId);
    }, duration);

    setToasts((prevToasts) => [{ id: randomId, message, type, options }, ...prevToasts]);

    return () => {
      clearTimeout(removeTimer);
    };
  }, [removeToast]);

  const contextValue = useMemo(() => ({
    success: (message: string, options?: ToastOptions) => addToast(message, 'success', options),
    error: (message: string, options?: ToastOptions) => addToast(message, 'error', options),
    info: (message: string, options?: ToastOptions) => addToast(message, 'info', options),
    warn: (message: string, options?: ToastOptions) => addToast(message, 'warn', options),
  }), [addToast]);

  // Just some basic styles to get you up and running. 
  // You will probably want to place these in an external style sheet.
  const containerStyles: CSSProperties = {
    position: 'fixed',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    zIndex: 999,
    pointerEvents: 'none',
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
            options={toast.options}
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
  type: ToastType;
  options?: ToastOptions;
}

const Toast = ({ message, type, options = {}}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { duration = 5000 } = options;

  const typeToColor = {
    'success': '#17c37b',
    'error': '#ef4444',
    'info': '#4a90e2',
    'warn': '#eab308'
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
    }, duration - 500)

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