import { Link, useLocation, useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function UserMenu() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onAdminPage = pathname.startsWith('/admin');

  // still checking who is logged in: show nothing for a moment
  if (loading) return null;

  // nobody logged in: show a Sign in link
  if (!user) {
    return (
      <Link
        to="/sign-in"
        className="text-sm font-medium text-primary hover:underline"
      >
        Sign in
      </Link>
    );
  }

  // logged in: show their name, an Admin link (admin only) and Sign out
  const name = user.user_metadata?.full_name || user.email;

  async function handleSignOut() {
    await signOut();
    navigate('/', { replace: true });
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <span className="hidden text-muted-foreground sm:inline">Hi, {name}</span>
      {/* admin only: on admin pages link to the blog, on blog pages link to admin */}
      {isAdmin && (
        <Link
          to={onAdminPage ? '/' : '/admin'}
          className="font-medium text-primary hover:underline"
        >
          {onAdminPage ? 'View blog' : 'Admin'}
        </Link>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignOut}
        className="rounded-full"
      >
        <LogOut className="size-4" />
        Sign out
      </Button>
    </div>
  );
}
