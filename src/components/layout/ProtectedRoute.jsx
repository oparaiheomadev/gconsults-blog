import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute() {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <p className="p-10 text-muted-foreground">Loading...</p>;
  if (!user) return <Navigate to="/sign-in" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
