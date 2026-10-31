import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { ADMIN_EMAIL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/auth/PasswordInput';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // admin goes to the dashboard, everyone else to the blog
    const isAdmin = data.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    navigate(isAdmin ? '/admin' : '/', { replace: true });
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to like and comment on posts."
      footer={
        <>
          New here?{' '}
          <Link
            to="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-2 bg-background"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-2">
            <PasswordInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthCard>
  );
}
