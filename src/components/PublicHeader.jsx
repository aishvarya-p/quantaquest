import { Link } from 'react-router-dom';

export default function PublicHeader({ rightLink }) {
  return (
    <header className="sticky top-0 z-30 bg-light-surface-container-lowest border-b-2 border-light-outline-variant">
      <div className="max-w-7xl mx-auto px-page-margin py-3 flex items-center justify-between gap-gutter-md">
        <Link
          to="/welcome"
          className="flex items-center gap-gutter-sm shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary rounded-md"
        >
          <span
            className="w-10 h-10 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface flex items-center justify-center tile-shadow"
            aria-hidden="true"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </span>
          <div className="flex flex-col">
            <span className="font-headline text-headline-md text-light-on-surface leading-none">
              QuantaQuest
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Adventure Atlas
            </span>
          </div>
        </Link>

        {rightLink || (
          <div className="flex items-center gap-gutter-sm shrink-0">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low font-label text-label-lg transition-colors duration-state-change"
            >
              <span>Log In</span>
            </Link>
            <Link
              to="/register"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container font-label text-label-lg transition-colors duration-state-change"
            >
              <span>Create Account</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
