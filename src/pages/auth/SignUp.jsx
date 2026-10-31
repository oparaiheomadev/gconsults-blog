import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthCard from '@/components/auth/AuthCard';
import PasswordInput from '@/components/auth/PasswordInput';

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Our own check before asking Supabase
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() }, // saved on the user as user_metadata
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Confirm email OFF: Supabase logs them in straight away -> go home.
    // Confirm email ON:  no session yet -> go type the 6-digit code.
    if (data.session) {
      navigate('/', { replace: true });
    } else {
      navigate(`/verify?email=${encodeURIComponent(email)}`, { replace: true });
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join to like and comment on posts."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            autoComplete="name"
            className="mt-2 bg-background"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="mt-2 bg-background"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-full"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthCard>
  );
}
