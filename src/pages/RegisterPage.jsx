import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import { useAuth } from '../context/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const result = register({ name, email, password, confirmPassword });
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
          aria-labelledby="register-heading"
          className="w-full max-w-md bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-xl flex flex-col gap-gutter-lg"
        >
          <header className="flex flex-col gap-gutter-sm">
            <span className="w-12 h-12 rounded-lg bg-light-tertiary-container text-light-on-tertiary-container border-2 border-light-tertiary flex items-center justify-center tile-shadow">
              <span className="material-symbols-outlined text-headline-lg" aria-hidden="true">
                person_add
              </span>
            </span>
            <div>
              <h1
                id="register-heading"
                className="font-headline text-headline-lg text-light-on-surface"
              >
                Create Explorer Account
              </h1>
              <p className="font-body text-body-md text-light-on-surface-variant">
                Set up your student profile to start your math adventure.
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
              <label
                htmlFor="register-name"
                className="font-label text-label-lg text-light-on-surface"
              >
                Student Name
              </label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Alex Rivera"
                className="h-12 px-gutter-md rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-light-primary focus:outline-none font-body text-body-md"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-email"
                className="font-label text-label-lg text-light-on-surface"
              >
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError('');
                }}
                placeholder="alex@school.edu"
                className="h-12 px-gutter-md rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-light-primary focus:outline-none font-body text-body-md"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-password"
                className="font-label text-label-lg text-light-on-surface"
              >
                Password
              </label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  if (error) setError('');
                }}
                placeholder="At least 6 characters"
                className="h-12 px-gutter-md rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-light-primary focus:outline-none font-body text-body-md"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="register-confirm"
                className="font-label text-label-lg text-light-on-surface"
              >
                Confirm Password
              </label>
              <input
                id="register-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  if (error) setError('');
                }}
                placeholder="Re-enter your password"
                className="h-12 px-gutter-md rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant focus:border-light-primary focus:outline-none font-body text-body-md"
              />
            </div>

            <button
              type="submit"
              className="mt-gutter-xs h-12 px-gutter-lg rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change inline-flex items-center justify-center gap-gutter-sm"
            >
              <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                person_add
              </span>
              <span className="font-label text-label-lg">Create Account</span>
            </button>
          </form>

          <footer className="pt-gutter-sm border-t border-light-outline-variant text-center">
            <p className="font-body text-body-md text-light-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="text-light-primary font-label hover:underline">
                Log In
              </Link>
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}
