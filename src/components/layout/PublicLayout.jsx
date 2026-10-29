import { Outlet } from 'react-router';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border px-6 py-4 font-serif text-lg">
        GConsults
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
