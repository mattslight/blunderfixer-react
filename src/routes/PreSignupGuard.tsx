import { Navigate } from 'react-router-dom';
import { useUsername } from '@/hooks/useUsername';

export default function PreSignupGuard({ children }) {
  const { username } = useUsername();
  return username ? <Navigate to="/games" replace /> : children;
}
