import React from 'react';
import { Navigate } from 'react-router-dom';

import { useProfile } from '@/hooks/useProfile';

type Props = { children: React.ReactNode };

export default function PreSignupGuard({ children }: Props) {
  const {
    profile: { username },
  } = useProfile();
  return username ? <Navigate to="/games" replace /> : children;
}
