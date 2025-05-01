import { useCallback, useState } from 'react';

export function useCoachExplanation() {
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [error, setError] = useState(null);

  const getExplanation = useCallback(
    async ({ fen, lines, legal_moves, features }) => {
      setLoadingExplanation(true);
      setExplanation(null);
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
        const text = await res.text(); // read raw body
        let data;
        try {
          data = JSON.parse(text); // parse JSON once
        } catch {
          console.error('❌ Invalid JSON:', text);
          setError('Invalid JSON from server');
          return;
        }

        if (!res.ok) {
          console.error('❌ Validation errors:', data.detail);
          setError('Validation error: see console');
          return;
        }

        if (data.explanation) {
          setExplanation(data.explanation);
        } else {
          setError('No explanation returned.');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching explanation.');
      } finally {
        setLoadingExplanation(false);
      }
    },
    []
  );

  return { explanation, loadingExplanation, error, getExplanation };
}
