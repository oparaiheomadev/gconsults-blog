import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/auth/PasswordInput';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // The email link logs the person in for a short time.
  // Still checking? Wait. No login? The link is old or already used.
  if (authLoading) {
    return <p className="p-10 text-muted-foreground">Loading...</p>;
  }

  if (!user) {
    return (
      <AuthCard
        title="Link expired"
        subtitle="This reset link is invalid or has already been used."
      >
        <Link
          to="/forgot-password"
          className="block w-full rounded-full bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get a new link
        </Link>
      </AuthCard>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    navigate(isAdmin ? '/admin' : '/', { replace: true });
  }

  return (
    <AuthCard title="Set a new password" subtitle={`For ${user.email}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">New password</Label>
          <div className="mt-2">
            <PasswordInput
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="mt-2">
            <PasswordInput
              id="confirm"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full"
        >
          {loading ? 'Saving…' : 'Save new password'}
        </Button>
      </form>
    </AuthCard>
  );
}
