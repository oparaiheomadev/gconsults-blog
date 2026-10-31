import { Link, Outlet } from 'react-router';
import UserMenu from '@/components/layout/UserMenu';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* temporary header: the real Navbar comes with the public pages */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <Link to="/" className="font-serif text-lg">
          GConsults
        </Link>
        <UserMenu />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-foreground px-6 py-8 text-sm text-background">
        GConsults
      </footer>
    </div>
  );
}
