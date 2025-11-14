import { useState, useRef, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const valueRef = useRef<T>(storedValue);
  
  useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(valueRef.current) : value;
      valueRef.current = valueToStore;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to save to localStorage');
    }
  };

  return [storedValue, setValue] as const;
}