import { useEffect } from 'react';

const CONFETTI_PIECES = [
  { left: '10%', delay: '0s', color: 'bg-realm-challenge' },
  { left: '22%', delay: '0.15s', color: 'bg-xp-gold' },
  { left: '35%', delay: '0.05s', color: 'bg-realm-calculator' },
  { left: '50%', delay: '0.2s', color: 'bg-realm-geometry' },
  { left: '66%', delay: '0.1s', color: 'bg-realm-tables' },
  { left: '78%', delay: '0.25s', color: 'bg-realm-challenge' },
  { left: '90%', delay: '0.08s', color: 'bg-light-primary' },
];

export default function LevelUpModal({ levelUpEvent, onClose }) {
  useEffect(() => {
    if (!levelUpEvent) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [levelUpEvent, onClose]);

  if (!levelUpEvent) {
    return null;
  }

  const { newLevel, totalXp } = levelUpEvent;

  return (
    <div
      className="fixed inset-0 z-50 bg-light-on-surface/55 p-page-margin flex items-center justify-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="levelup-title"
        className="levelup-pop relative overflow-hidden w-full max-w-md bg-light-surface-container-lowest rounded-xl border-2 border-light-on-surface tile-shadow-ink p-gutter-xl flex flex-col items-center text-center gap-gutter-md"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Lightweight CSS Confetti & Stars */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden" aria-hidden="true">
          {CONFETTI_PIECES.map((piece, idx) => (
            <span
              key={idx}
              style={{ left: piece.left, animationDelay: piece.delay }}
              className={`confetti-float absolute top-2 w-3 h-3 rounded-sm border border-light-on-surface ${piece.color}`}
            />
          ))}
        </div>

        <span className="relative z-10 w-20 h-20 rounded-xl bg-light-secondary-container text-light-on-secondary-container border-2 border-light-on-surface tile-shadow-ink flex items-center justify-center">
          <span
            className="material-symbols-outlined text-display-lg"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            emoji_events
          </span>
        </span>

        <span className="relative z-10 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-xp-gold text-on-xp-gold border-2 border-light-on-surface font-headline text-label-lg">
          <span
            className="material-symbols-outlined text-title-md"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            stars
          </span>
          <span>LEVEL UP!</span>
        </span>

        <div className="relative z-10 flex flex-col gap-gutter-xs">
          <h2
            id="levelup-title"
            className="font-headline text-display-lg-mobile sm:text-display-lg text-light-on-surface"
          >
            Level {newLevel}
          </h2>
          <p className="font-body text-body-lg text-light-on-surface-variant text-pretty">
            {newLevel === 10
              ? 'Incredible! You reached the maximum explorer level in QuantaQuest!'
              : 'Awesome math skills! Keep solving quests and practicing tables to climb even higher.'}
          </p>
        </div>

        <div className="relative z-10 px-4 py-2 rounded-lg bg-light-surface-container-low border border-light-outline-variant font-mono text-mono-sm text-light-on-surface tabular-nums">
          Total XP: {totalXp.toLocaleString()} XP
        </div>

        <button
          type="button"
          onClick={onClose}
          className="relative z-10 w-full sm:w-auto inline-flex items-center justify-center gap-gutter-sm px-gutter-xl py-3 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
        >
          <span className="font-label text-label-lg">Continue Adventure</span>
          <span className="material-symbols-outlined text-title-md" aria-hidden="true">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
