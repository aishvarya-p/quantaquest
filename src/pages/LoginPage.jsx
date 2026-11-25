import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const result = login({ email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError('');
    navigate('/', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-on-background">
      <PublicHeader
        rightLink={
          <Link
            to="/welcome"
            className="inline-flex items-center gap-1.5 text-light-primary hover:underline font-label text-label-lg"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">
              arrow_back
            </span>
            <span>Back to Welcome</span>
          </Link>
        }
      />

      <main className="flex-1 flex items-center justify-center px-page-margin py-gutter-xl">
        <section
          aria-labelledby="login-heading"
          className="w-full max-w-md bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-xl flex flex-col gap-gutter-lg"
        >
          <header className="flex flex-col gap-gutter-sm">
            <span className="w-12 h-12 rounded-lg bg-light-primary-container text-light-on-primary-container border-2 border-light-on-surface flex items-center justify-center tile-shadow">
              <span className="material-symbols-outlined text-headline-lg" aria-hidden="true">
                login
              </span>
            </span>
            <div>
              <h1 id="login-heading" className="font-headline text-headline-lg text-light-on-surface">
                Explorer Login
              </h1>
              <p className="font-body text-body-md text-light-on-surface-variant">
                Sign in with your email and password to enter QuantaQuest.
              </p>
            </div>
          </header>

          {error && (
            <div
              role="alert"
              className="p-3 rounded-lg bg-light-error-container border-2 border-light-error text-light-on-error-container flex items-start gap-gutter-sm"
            >
              <span
                className="material-symbols-outlined text-title-lg shrink-0"
                style={{ fontVariationSettings: "'FILL' 1" }}
                aria-hidden="true"
              >
                error
              </span>
              <p className="font-body text-body-md">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-gutter-md">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="font-label text-label-lg text-light-on-surface">
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                }}
                placeholder="explorer@school.edu"
                className="h-12 px-gutter-md rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-light-primary focus:outline-none font-body text-body-md"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="font-label text-label-lg text-light-on-surface"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-gutter-md pr-12 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-light-primary focus:outline-none font-body text-body-md"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 w-8 h-8 rounded-md text-light-on-surface-variant hover:text-light-on-surface flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-gutter-xs h-12 px-gutter-lg rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change inline-flex items-center justify-center gap-gutter-sm"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                login
              </span>
              <span className="font-label text-label-lg">Login</span>
            </button>
          </form>

          <footer className="pt-gutter-sm border-t border-light-outline-variant text-center">
            <p className="font-body text-body-md text-light-on-surface-variant">
              New to QuantaQuest?{' '}
              <Link to="/register" className="text-light-primary font-label hover:underline">
                Create an Account
              </Link>
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
