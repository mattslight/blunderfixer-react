import { useCallback, useState } from 'react';

export function useCoachExplanation() {
  const [explanation, setExplanation] = useState(null);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [error, setError] = useState(null);

  const getExplanation = useCallback(
    async ({ fen, top_moves, legal_moves, features }) => {
      setLoadingExplanation(true);
      setExplanation(null);
      setError(null);
      try {
        const res = await fetch('http://127.0.0.1:8000/explain-lines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fen, top_moves, legal_moves, features }),
        });
        const data = await res.json();
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
