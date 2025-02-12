"use client"
import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warn';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  onDismiss?: (id: string) => void;
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
    const { duration = 5000, onDismiss } = options;
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

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
  
      {/* Render multiple toast containers dynamically based on active positions */}
      {['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'].map((position) => (
        <div key={position} className={`toast-container ${position}`}>
          {toasts
            .filter((toast) => toast.options?.position === position)
            .map((toast) => (
              <div key={toast.id} className="toast-wrapper">
                <Toast {...toast} />
              </div>
            ))}
        </div>
      ))}
  
      <style jsx>{`
        .toast-container {
          position: fixed;
          display: flex;
          flex-direction: column;
          pointer-events: none; /* Allows clicks to pass through */
          z-index: 99999;
          background: red;
        }
  
        .toast-wrapper {
          transition: all 0.1s ease-in;
          margin-top: 0;
          pointer-events: auto; /* Allows interaction with the toast itself */
        }
  
        .toast-wrapper + .toast-wrapper {
          margin-top: 1rem;
        }
  
        /* Position Variants */
        .top-right { top: 1rem; right: 1rem; align-items: flex-end; }
        .top-left { top: 1rem; left: 1rem; align-items: flex-start; }
        .bottom-right { bottom: 1rem; right: 1rem; align-items: flex-end; }
        .bottom-left { bottom: 1rem; left: 1rem; align-items: flex-start; }
        .bottom-center { bottom: 1rem; left: 1rem; transform: translateX(calc(50vw - 50%)); align-items: flex-start; }
        .top-center { top: 1rem; left: 1rem; transform: translateX(calc(50vw - 50%)); align-items: flex-start; }
      `}</style>
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
  id: string,
  message: string;
  type: ToastType;
  options?: ToastOptions
}

const Toast = ({ message, type, id, options = {} }: ToastProps) => {
  const { duration = 5000, position = 'top-right', onDismiss } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const slideTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 500); // Start hiding before full duration ends

    return () => {
      clearTimeout(slideTimer);
    };
  }, [duration]);

  return (
    <>
      <div
        className={`toast ${type} ${position} ${isVisible ? 'visible' : ''}`}
        role="alert"
      >
        {message}
        {onDismiss && <button onClick={() => onDismiss(id)}>X</button>}
      </div>

      <style jsx>{`
        .toast {
          --success-color: #22c55e;
          --error-color: #ef4444;
          --info-color: #3b82f6;
          --warn-color: #eab308;

          position: relative;
          z-index: 999;
          padding: 1rem;
          border-radius: 0.375rem;
          font-weight: 600;
          color: #fff;
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          transition: transform 300ms ease-in-out, opacity 200ms ease-in-out;
          opacity: 0;
        }

        /* Entry / Exit Animations Based on Position */
        .top-right, .bottom-right {
          transform: translateX(100%);
        }

        .top-left, .bottom-left {
          transform: translateX(-100%);
        }

        .bottom-right, .bottom-left .bottom-center {
          transform: translateY(100%);
        }

        .top-center {
          transform: translateY(-100%);
        }

        .visible {
          transform: translateX(0) translateY(0);
          opacity: 1;
        }

        /* Background Colors */
        .toast.success { background-color: var(--success-color); }
        .toast.error { background-color: var(--error-color); }
        .toast.info { background-color: var(--info-color); }
        .toast.warn { background-color: var(--warn-color); }
      `}</style>
    </>
  );
};
