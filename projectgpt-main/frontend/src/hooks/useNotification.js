import { useCallback, useState } from 'react';

let idCounter = 0;

export const useNotification = () => {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2800);
  }, []);

  return {
    toasts,
    dismiss: (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id)),
    success: (msg) => push('success', msg),
    error: (msg) => push('error', msg)
  };
};
