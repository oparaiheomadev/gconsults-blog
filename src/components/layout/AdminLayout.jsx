import { Outlet } from 'react-router';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Outlet />
    </div>
  );
}
