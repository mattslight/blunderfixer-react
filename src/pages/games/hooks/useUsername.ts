// src/hooks/useUsername.ts
import { useState, useEffect, useCallback } from 'react';

export function useUsername(): [string, (u: string) => void] {
  // 1) initialize from localStorage
  const [username, setUsernameState] = useState<string>(
    () => localStorage.getItem('bf:username') ?? ''
  );

  // 2) whenever it changes, persist it
  useEffect(() => {
    localStorage.setItem('bf:username', username);
  }, [username]);

  // wrap setter in useCallback
  const setUsername = useCallback((u: string) => {
    setUsernameState(u);
  }, []);

  return [username, setUsername];
}
