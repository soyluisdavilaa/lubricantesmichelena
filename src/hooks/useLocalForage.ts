"use client";

/* Hook genérico para leer/escribir datos con localforage */

import { useState, useEffect, useCallback } from "react";

export function useLocalForage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const lf = (await import("localforage")).default;
        const saved = await lf.getItem<T>(key);
        if (saved !== null) setValue(saved);
      } catch (err) {
        console.error(`Error loading ${key}:`, err);
      } finally {
        setIsLoaded(true);
      }
    }
    load();
  }, [key]);

  const save = useCallback(
    async (newValue: T) => {
      setValue(newValue);
      try {
        const lf = (await import("localforage")).default;
        await lf.setItem(key, newValue);
      } catch (err) {
        console.error(`Error saving ${key}:`, err);
      }
    },
    [key]
  );

  return { value, save, isLoaded } as const;
}
