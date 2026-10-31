import { Link, Outlet } from 'react-router';
import UserMenu from '@/components/layout/UserMenu';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <Link to="/admin" className="font-serif text-lg">
          GConsults <span className="text-muted-foreground">Admin</span>
        </Link>
        <UserMenu />
      </header>
      <Outlet />
    </div>
  );
}
