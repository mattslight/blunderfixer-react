import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';

export default function PreSignupGuard({ children }) {
  const {
    profile: { username },
  } = useProfile();
  return username ? <Navigate to="/games" replace /> : children;
}
