import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useProgress } from '../context/useProgress';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/challenge', label: 'Challenges', icon: 'swords' },
  { to: '/calculator', label: 'Calculator', icon: 'calculate' },
  { to: '/tables', label: 'Tables', icon: 'grid_on' },
  { to: '/shapes', label: 'Shapes', icon: 'pentagon' },
];

const AVATAR_URL = '/assets/maya-avatar.png';

export default function AppHeader() {
  const { currentUser, logout } = useAuth();
  const { progress, levelInfo } = useProgress();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/welcome', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 bg-light-surface-container-lowest border-b-2 border-light-outline-variant">
      <div className="max-w-7xl mx-auto px-page-margin py-3 flex items-center justify-between gap-gutter-md">
        {/* Brand Mark & Wordmark */}
        <Link
          to="/"
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

        {/* Primary Realm Navigation */}
        <nav
          aria-label="Learning activities"
          className="hidden lg:flex items-center gap-gutter-xs bg-light-surface-container-low p-1.5 rounded-full border-2 border-light-outline-variant"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors duration-state-change ease-state-change ${
                  isActive
                    ? 'bg-light-primary text-light-on-primary'
                    : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-title-md"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className="font-label text-label-lg">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Student Profile & Streak */}
        <div className="flex items-center gap-gutter-sm shrink-0">
          {/* Streak Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-light-secondary-container text-light-on-secondary-container border-2 border-light-secondary">
            <span
              className="material-symbols-outlined text-title-md"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              local_fire_department
            </span>
            <span className="font-mono text-mono-sm tabular-nums">{progress.streakDays}d</span>
            <span className="font-label text-label-sm">Streak</span>
          </div>

          {/* Student Profile Pill */}
          <div className="flex items-center gap-gutter-sm pl-1.5 pr-3 py-1 rounded-full bg-light-surface-container-low border-2 border-light-outline-variant">
            <div
              role="img"
              aria-label={`${currentUser?.name || 'Explorer'} avatar`}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-light-primary bg-light-primary-container shrink-0"
            >
              <img
                src={AVATAR_URL}
                alt={`${currentUser?.name || 'Explorer'} portrait`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-label text-label-lg text-light-on-surface leading-tight">
                {currentUser?.name || 'Explorer'}
              </span>
              <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                Level {levelInfo.level}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-light-surface-container-low text-light-on-surface-variant border-2 border-light-outline-variant hover:border-realm-challenge hover:bg-realm-challenge-soft hover:text-on-realm-challenge-soft transition-colors duration-state-change"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">
              logout
            </span>
            <span className="hidden sm:inline font-label text-label-sm">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
