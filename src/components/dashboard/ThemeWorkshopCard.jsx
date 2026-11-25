import { useEffect, useState } from 'react';
import { useProgress } from '../../context/useProgress';

const THEMES = [
  {
    id: 'atlas',
    name: 'Sunlit Atlas',
    swatchClass: 'bg-light-primary',
    unlockHint: 'Default',
    description: 'Bright expedition sky paired with deep cobalt ink and warm amber XP accents.',
    previewBgClass: 'bg-light-background border-light-primary text-light-on-background',
    previewAccentClass: 'bg-light-primary text-light-on-primary',
    previewPillClass: 'bg-light-secondary-container text-light-on-secondary-container',
  },
  {
    id: 'ocean',
    name: 'Coral Reef',
    swatchClass: 'bg-realm-geometry',
    unlockHint: '50 XP',
    description: 'Breezy lagoon teal with seafoam highlights and coral quest accents.',
    previewBgClass: 'bg-realm-geometry-soft border-realm-geometry text-on-realm-geometry-soft',
    previewAccentClass: 'bg-realm-geometry text-on-realm-geometry',
    previewPillClass: 'bg-realm-challenge-soft text-on-realm-challenge-soft',
  },
];

export default function ThemeWorkshopCard() {
  const { progress, updateSelectedTheme } = useProgress();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const selectedTheme = progress.selectedTheme || 'atlas';
  const unlockedThemes = progress.unlockedThemes || ['atlas'];

  useEffect(() => {
    if (!isPreviewOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen]);

  return (
    <>
      <article className="h-full bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col justify-between gap-gutter-md">
        <header className="flex flex-col gap-gutter-xs">
          <h2 className="font-headline text-headline-md text-light-on-surface">Theme Workshop</h2>
          <p className="font-body text-body-md text-light-on-surface-variant">
            Switch your adventure world look
          </p>
        </header>

        {/* Interactive Theme Swatch List */}
        <div className="flex flex-col gap-gutter-sm" id="theme-list">
          {THEMES.map((theme) => {
            const isUnlocked = unlockedThemes.includes(theme.id);
            const isActive = selectedTheme === theme.id;

            if (!isUnlocked) {
              return (
                <div
                  key={theme.id}
                  className="w-full p-2.5 rounded-md border border-dashed border-light-outline bg-light-surface-container-low flex items-center justify-between gap-gutter-sm"
                >
                  <div className="flex items-center gap-gutter-sm">
                    <span
                      className={`w-7 h-7 rounded-sm border border-light-outline flex items-center justify-center text-light-on-primary shrink-0 ${theme.swatchClass}`}
                    >
                      <span className="material-symbols-outlined text-label-lg" aria-hidden="true">
                        lock
                      </span>
                    </span>
                    <span className="font-label text-label-lg text-light-on-surface-variant">
                      {theme.name}
                    </span>
                  </div>
                  <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
                    {theme.unlockHint}
                  </span>
                </div>
              );
            }

            return (
              <button
                key={theme.id}
                type="button"
                data-theme={theme.id}
                aria-pressed={isActive}
                onClick={() => updateSelectedTheme(theme.id)}
                className={`theme-option w-full p-2.5 rounded-md border-2 flex items-center justify-between gap-gutter-sm text-left transition-colors duration-state-change ease-state-change ${
                  isActive
                    ? 'border-light-primary bg-light-surface-container-low'
                    : 'border-light-outline-variant bg-light-surface-container-lowest hover:bg-light-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-gutter-sm">
                  <span
                    className={`w-7 h-7 rounded-sm border border-light-on-surface shrink-0 ${theme.swatchClass}`}
                  />
                  <span className="font-label text-label-lg text-light-on-surface">
                    {theme.name}
                  </span>
                </div>
                <span
                  className={`font-label text-label-sm ${
                    isActive ? 'text-light-primary' : 'text-light-on-surface-variant'
                  }`}
                >
                  {isActive ? 'Active' : 'Unlocked'}
                </span>
              </button>
            );
          })}

          <div className="w-full p-2.5 rounded-md border border-dashed border-light-outline bg-light-surface-container-low flex items-center justify-between gap-gutter-sm">
            <div className="flex items-center gap-gutter-sm">
              <span className="w-7 h-7 rounded-sm bg-dark-surface border border-light-outline flex items-center justify-center text-dark-primary shrink-0">
                <span className="material-symbols-outlined text-label-lg" aria-hidden="true">
                  nights_stay
                </span>
              </span>
              <span className="font-label text-label-lg text-light-on-surface-variant">
                Cosmic Lab
              </span>
            </div>
            <span className="font-label text-label-sm text-light-on-surface-variant tabular-nums">
              Lvl 8
            </span>
          </div>
        </div>

        <footer className="pt-gutter-xs">
          <button
            id="preview-theme-btn"
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="w-full inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
          >
            <span className="material-symbols-outlined text-title-md" aria-hidden="true">
              palette
            </span>
            <span className="font-label text-label-lg">Preview Themes</span>
          </button>
        </footer>
      </article>

      {/* Theme Preview Dialog */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-light-on-surface/50 p-page-margin flex items-center justify-center"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="theme-preview-title"
            className="w-full max-w-2xl bg-light-surface-container-lowest rounded-xl border-2 border-light-on-surface tile-shadow-ink p-gutter-xl flex flex-col gap-gutter-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-start justify-between gap-gutter-md">
              <div className="flex items-center gap-gutter-sm">
                <span className="w-10 h-10 rounded-md bg-light-primary-container text-light-on-primary-container border-2 border-light-on-surface flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    palette
                  </span>
                </span>
                <div>
                  <h3
                    id="theme-preview-title"
                    className="font-headline text-headline-md text-light-on-surface"
                  >
                    Theme Workshop Preview
                  </h3>
                  <p className="font-body text-body-md text-light-on-surface-variant">
                    Compare worlds and unlock new themes as you earn XP
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close theme preview"
                onClick={() => setIsPreviewOpen(false)}
                className="w-9 h-9 rounded-md bg-light-surface-container-low text-light-on-surface border-2 border-light-outline-variant hover:border-light-primary flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-title-md" aria-hidden="true">
                  close
                </span>
              </button>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
              {THEMES.map((theme) => {
                const isUnlocked = unlockedThemes.includes(theme.id);
                const isActive = selectedTheme === theme.id;

                if (!isUnlocked) {
                  return (
                    <div
                      key={theme.id}
                      className={`p-gutter-md rounded-xl border-2 border-dashed flex flex-col justify-between gap-gutter-sm opacity-80 ${theme.previewBgClass}`}
                    >
                      <div className="flex flex-col gap-gutter-xs">
                        <div className="flex items-center justify-between gap-gutter-xs">
                          <span className="px-2.5 py-0.5 rounded-full font-label text-label-sm bg-light-surface-container-lowest text-light-on-surface-variant inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-label-sm" aria-hidden="true">
                              lock
                            </span>
                            {theme.unlockHint}
                          </span>
                        </div>
                        <span className="font-headline text-title-lg pt-1">{theme.name}</span>
                        <p className="font-body text-body-md opacity-90">{theme.description}</p>
                      </div>
                    </div>
                  );
                }

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => updateSelectedTheme(theme.id)}
                    className={`p-gutter-md rounded-xl border-2 text-left flex flex-col justify-between gap-gutter-sm transition-transform duration-state-change hover:-translate-y-0.5 ${
                      theme.previewBgClass
                    } ${isActive ? 'ring-2 ring-light-primary ring-offset-2' : ''}`}
                  >
                    <div className="flex flex-col gap-gutter-xs">
                      <div className="flex items-center justify-between gap-gutter-xs">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-label text-label-sm ${theme.previewAccentClass}`}
                        >
                          {isActive ? 'Active' : 'Select'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-mono-sm ${theme.previewPillClass}`}
                        >
                          XP
                        </span>
                      </div>
                      <span className="font-headline text-title-lg pt-1">{theme.name}</span>
                      <p className="font-body text-body-md opacity-90">{theme.description}</p>
                    </div>
                  </button>
                );
              })}

              {/* Cosmic Lab Locked Preview */}
              <div className="p-gutter-md rounded-xl border-2 border-dashed border-dark-outline bg-dark-background text-dark-on-background flex flex-col justify-between gap-gutter-sm">
                <div className="flex flex-col gap-gutter-xs">
                  <div className="flex items-center justify-between gap-gutter-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-label text-label-sm bg-dark-surface-container-high text-dark-primary inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-label-sm" aria-hidden="true">
                        lock
                      </span>
                      Lvl 8
                    </span>
                    <span className="material-symbols-outlined text-title-md text-dark-secondary" aria-hidden="true">
                      nights_stay
                    </span>
                  </div>
                  <span className="font-headline text-title-lg pt-1 text-dark-on-surface">
                    Cosmic Lab
                  </span>
                  <p className="font-body text-body-md text-dark-on-surface-variant">
                    Reach Level 8 in future adventures to unlock midnight starlight mode.
                  </p>
                </div>
              </div>
            </div>

            <footer className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-2.5 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 transition-transform duration-state-change ease-state-change"
              >
                <span className="font-label text-label-lg">Done</span>
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
