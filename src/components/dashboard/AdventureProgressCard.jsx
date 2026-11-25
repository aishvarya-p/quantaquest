import { useProgress } from '../../context/useProgress';

export default function AdventureProgressCard() {
  const { progress, levelInfo } = useProgress();

  const totalAttempted =
    progress.challengeAttempted + progress.tablesAttempted + progress.shapeQuizAttempted;
  const totalCorrect =
    progress.challengeCorrect + progress.tablesCorrect + progress.shapeQuizCorrect;
  const overallAccuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  return (
    <article className="h-full bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col justify-between gap-gutter-md">
      <header className="flex items-center justify-between gap-gutter-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="w-11 h-11 rounded-md bg-light-secondary-container text-light-on-secondary-container border-2 border-light-secondary flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-headline-md"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              military_tech
            </span>
          </span>
          <div>
            <h2 className="font-headline text-headline-md text-light-on-surface">
              Adventure Progress
            </h2>
            <p className="font-body text-body-md text-light-on-surface-variant">
              Level {levelInfo.level} Explorer
            </p>
          </div>
        </div>
        <span className="font-mono text-mono-lg text-light-secondary tabular-nums">
          {levelInfo.totalXp.toLocaleString()} XP
        </span>
      </header>

      {/* Progress Bar */}
      <div className="flex flex-col gap-gutter-sm bg-light-surface-container-low p-gutter-md rounded-lg border border-light-outline-variant">
        <div className="flex items-center justify-between gap-gutter-sm">
          <span className="font-label text-label-lg text-light-on-surface">
            {levelInfo.isMaxLevel
              ? 'Maximum Level Reached'
              : `Level ${levelInfo.level} to ${levelInfo.nextLevel}`}
          </span>
          <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
            {levelInfo.isMaxLevel
              ? `${levelInfo.totalXp.toLocaleString()} XP`
              : `${levelInfo.totalXp.toLocaleString()} / ${levelInfo.nextThreshold.toLocaleString()} XP`}
          </span>
        </div>
        <div
          className="w-full h-4 rounded-full bg-xp-gold-track border border-light-secondary overflow-hidden"
          role="progressbar"
          aria-valuenow={levelInfo.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={
            levelInfo.isMaxLevel
              ? 'Maximum explorer level reached'
              : `XP progress to Level ${levelInfo.nextLevel}`
          }
        >
          <div
            className="h-full bg-xp-gold rounded-full transition-all duration-surface-enter ease-surface-enter"
            style={{ width: `${levelInfo.progressPercent}%` }}
          />
        </div>
        <p className="font-body text-body-md text-light-on-surface-variant tabular-nums">
          {levelInfo.isMaxLevel
            ? 'Maximum Level Reached — keep earning XP across any realm!'
            : `${levelInfo.xpRemaining.toLocaleString()} XP left for Level ${levelInfo.nextLevel}`}
        </p>
      </div>

      {/* Compact Adventure Stats */}
      <div className="grid grid-cols-2 gap-gutter-md">
        <div className="bg-light-surface-container-low rounded-md p-3 border border-light-outline-variant flex items-center gap-gutter-sm">
          <span
            className="material-symbols-outlined text-title-lg text-light-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            flag
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-mono-lg text-light-on-surface tabular-nums leading-none">
              {progress.challengesCompleted}
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">Quests</span>
          </div>
        </div>
        <div className="bg-light-surface-container-low rounded-md p-3 border border-light-outline-variant flex items-center gap-gutter-sm">
          <span
            className="material-symbols-outlined text-title-lg text-light-tertiary"
            style={{ fontVariationSettings: "'FILL' 1" }}
            aria-hidden="true"
          >
            verified
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-mono-lg text-light-on-surface tabular-nums leading-none">
              {overallAccuracy}%
            </span>
            <span className="font-label text-label-sm text-light-on-surface-variant">
              Accuracy
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
