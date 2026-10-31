import { Routes, Route } from 'react-router';
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ScrollToTop from '@/components/layout/ScrollToTop';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Home from '@/pages/Home';
import Post from '@/pages/Post';
import NotFound from '@/pages/NotFound';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
import Dashboard from '@/pages/admin/Dashboard';
import PostEditor from '@/pages/admin/PostEditor';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public pages: navbar + footer */}
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="blog/:slug" element={<Post />} />
        </Route>

        {/* Auth pages: full screen, no navbar */}
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="verify" element={<VerifyEmail />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />

        {/* Admin pages: guarded, admin only */}
        <Route element={<ProtectedRoute />}>
          {/* Admin pages: admin frame (protected in step 2) */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/:id" element={<PostEditor />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
