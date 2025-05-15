// src/pages/analyse/hooks/useCoachExplanation.jsx

import { useCallback, useState } from 'react';

export default function useCoachExplanation() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getExplanation = useCallback(
    async ({ fen, lines, legal_moves, features }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/explain-lines`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fen, lines, legal_moves, features }),
          }
        );
        const text = await res.text();
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.detail || text);

        setExplanation(data.explanation);
        return data.explanation; // <— return it too
      } catch (err: any) {
        setError(err.message);
        throw err; // <— so caller can catch
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { explanation, loading, error, getExplanation };
}
