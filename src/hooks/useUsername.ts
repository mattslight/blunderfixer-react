// src/hooks/useUsername.ts
import { useState, useEffect, useCallback } from 'react';

export function useUsername(): {
  username: string;
  setUsername: (u: string) => void;
} {
  // initialize from localStorage
  const [username, setUsernameState] = useState<string>(
    () => localStorage.getItem('bf:username') ?? ''
  );

  // persist on change
  useEffect(() => {
    localStorage.setItem('bf:username', username);
  }, [username]);

  // stable setter
  const setUsername = useCallback((u: string) => {
    setUsernameState(u);
  }, []);

  return { username, setUsername };
}
