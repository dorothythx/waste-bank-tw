import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function ProtectedRoute({ allow, children }) {
  const { session } = useAuth();

  if (!session.role) {
    return <Navigate to="/login" replace />;
  }

  if (!allow.includes(session.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}
