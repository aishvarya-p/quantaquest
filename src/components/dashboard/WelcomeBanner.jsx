import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useProgress } from '../../context/useProgress';

const BANNER_IMAGE_URL = '/assets/adventure-island.png';

export default function WelcomeBanner() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { progress } = useProgress();

  const firstName = (currentUser?.name || 'Explorer').trim().split(/\s+/)[0];
  const expeditionDay = progress.streakDays > 0 ? progress.streakDays : 1;

  return (
    <section
      aria-label="Welcome adventure"
      className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 p-gutter-xl flex flex-col gap-gutter-md">
          <div className="inline-flex items-center gap-gutter-sm self-start px-3 py-1 rounded-full bg-light-tertiary-container text-light-on-tertiary-container border border-light-tertiary">
            <span
              className="material-symbols-outlined text-label-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
            >
              explore
            </span>
            <span className="font-label text-label-sm">Expedition Day {expeditionDay}</span>
          </div>

          <h1 className="font-headline text-display-lg-mobile md:text-display-lg text-light-on-surface text-balance">
            Welcome back, {firstName}! Ready for today’s math adventure?
          </h1>

          <p className="font-body text-body-lg text-light-on-surface-variant text-pretty max-w-prose">
            Pick a quest in Math Challenge, sharpen your speed in Tables Practice, or explore shapes
            and equations—every answer earns XP toward unlocking new rewards!
          </p>

          <div className="pt-gutter-xs flex flex-wrap items-center gap-gutter-md">
            <button
              type="button"
              onClick={() => navigate('/challenge')}
              className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
            >
              <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                play_arrow
              </span>
              <span className="font-label text-label-lg">Resume Daily Quest</span>
            </button>

            <span className="font-body text-body-md text-light-on-surface-variant tabular-nums">
              {progress.challengesCompleted} {progress.challengesCompleted === 1 ? 'quest' : 'quests'}{' '}
              completed
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 h-full min-h-[240px] bg-light-surface-container-low border-t-2 lg:border-t-0 lg:border-l-2 border-light-outline-variant p-gutter-md flex items-center justify-center">
          <img
            src={BANNER_IMAGE_URL}
            alt="Illustrated mathematical adventure island with geometric towers and a golden compass"
            className="w-full h-64 lg:h-72 object-cover rounded-lg border-2 border-light-outline-variant"
          />
        </div>
      </div>
    </section>
  );
}
