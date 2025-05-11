// src/pages/analyse/hooks/useFeatureExtraction.ts
import { extractFeatures } from '@/api';
import { useEffect, useState } from 'react';

export default function useFeatureExtraction(fen: string | null) {
  const [features, setFeatures] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fen) {
      setFeatures(null);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setError(null);

    extractFeatures(fen)
      .then((data) => {
        if (!isCancelled) {
          setFeatures(data);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err.message || 'Failed to fetch features');
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [fen]);

  return { features, loading, error };
}
