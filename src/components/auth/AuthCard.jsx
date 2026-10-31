import { Link } from 'react-router';
import logoLight from '@/assets/gconsults-light.png';

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-6 py-16">
      <div className="w-full max-w-sm">
        <Link to="/">
          <img
            src={logoLight}
            alt="GConsults Professional Services"
            className="mx-auto mb-8 h-9 w-auto shrink-0"
          />
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-center font-serif text-2xl">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 text-center text-sm text-muted-foreground">
              {subtitle}
            </p>
          )}
          <div className="mt-7">{children}</div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </p>
        )}
      </div>
    </main>
  );
}
