export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  },
  // Specifically for themes which are stored as raw strings in this app currently, 
  // but let's make it consistent and use JSON.
  getRaw: (key: string, defaultValue: string): string => {
    return localStorage.getItem(key) || defaultValue;
  },
  setRaw: (key: string, value: string): void => {
    localStorage.setItem(key, value);
  }
};
