import { useProgress } from '../../context/useProgress';
import { BADGE_DEFINITIONS } from '../../utils/progressStorage';

export default function BadgeCaseCard() {
  const { progress } = useProgress();
  const earnedIds = progress.badges || [];
  const earnedCount = BADGE_DEFINITIONS.filter((b) => earnedIds.includes(b.id)).length;

  return (
    <article className="h-full bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col justify-between gap-gutter-md">
      <header className="flex items-center justify-between gap-gutter-sm">
        <div>
          <h2 className="font-headline text-headline-md text-light-on-surface">Badge Case</h2>
          <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
            {earnedCount} of {BADGE_DEFINITIONS.length} earned
          </p>
        </div>
        <span
          role="status"
          className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-light-tertiary-container text-light-on-tertiary-container border border-light-tertiary"
        >
          <span className="font-label text-label-sm tabular-nums">{earnedCount} Earned</span>
        </span>
      </header>

      <div className="grid grid-cols-2 gap-gutter-sm">
        {BADGE_DEFINITIONS.map((badge) => {
          const isEarned = earnedIds.includes(badge.id);

          if (isEarned) {
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border flex flex-col items-center text-center gap-1.5 ${badge.cardClasses}`}
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.circleClasses}`}
                >
                  <span
                    className="material-symbols-outlined text-title-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {badge.icon}
                  </span>
                </span>
                <span className={`font-label text-label-lg leading-tight ${badge.textClasses}`}>
                  {badge.name}
                </span>
              </div>
            );
          }

          return (
            <div
              key={badge.id}
              title={badge.hint}
              className="p-3 rounded-lg bg-light-surface-container-low border border-dashed border-light-outline flex flex-col items-center text-center gap-1.5"
            >
              <span className="w-10 h-10 rounded-full bg-light-surface-container-high text-light-on-surface-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                  lock
                </span>
              </span>
              <span className="font-label text-label-lg text-light-on-surface-variant leading-tight">
                {badge.name}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
