import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';

const REALM_HIGHLIGHTS = [
  {
    title: 'Math Challenge',
    desc: 'Timed & relaxed arithmetic quests',
    icon: 'swords',
    boxClass: 'bg-realm-challenge-soft text-on-realm-challenge-soft border-realm-challenge',
  },
  {
    title: 'Smart Calculator',
    desc: 'Test expressions with instant history',
    icon: 'calculate',
    boxClass: 'bg-realm-calculator-soft text-on-realm-calculator-soft border-realm-calculator',
  },
  {
    title: 'Tables Practice',
    desc: 'Master tables from 1× to 20×',
    icon: 'grid_on',
    boxClass: 'bg-realm-tables-soft text-on-realm-tables-soft border-realm-tables',
  },
  {
    title: 'Shape Explorer',
    desc: 'Explore sides, area & geometry riddles',
    icon: 'pentagon',
    boxClass: 'bg-realm-geometry-soft text-on-realm-geometry-soft border-realm-geometry',
  },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-on-background">
      <PublicHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-page-margin py-gutter-xl flex flex-col gap-gutter-xl justify-center">
        {/* Adventure Welcome Hero */}
        <section
          aria-label="Welcome to QuantaQuest"
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
                <span className="font-label text-label-sm">Gamified Math Adventure</span>
              </div>

              <h1 className="font-headline text-display-lg-mobile md:text-display-lg text-light-on-surface text-balance">
                Turn everyday math into an exciting adventure!
              </h1>

              <p className="font-body text-body-lg text-light-on-surface-variant text-pretty max-w-prose">
                Welcome to QuantaQuest! Practice multiplication tables, solve arithmetic waves,
                test equations with a smart calculator, and explore geometric shapes—all designed for
                curious school explorers.
              </p>

              <div className="pt-gutter-xs flex flex-wrap items-center gap-gutter-md">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-primary text-light-on-primary border-2 border-light-on-surface tile-shadow-ink hover:bg-light-primary-container active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
                >
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    person_add
                  </span>
                  <span className="font-label text-label-lg">Create Account</span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-gutter-sm px-gutter-lg py-3 rounded-md bg-light-surface-container-lowest text-light-on-surface border-2 border-light-outline-variant tile-shadow hover:bg-light-surface-container-low active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-primary transition-transform duration-state-change ease-state-change"
                >
                  <span className="material-symbols-outlined text-title-lg" aria-hidden="true">
                    login
                  </span>
                  <span className="font-label text-label-lg">Login</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 h-full min-h-[240px] bg-light-surface-container-low border-t-2 lg:border-t-0 lg:border-l-2 border-light-outline-variant p-gutter-md flex items-center justify-center">
              <img
                src="/assets/adventure-island.png"
                alt="Illustrated mathematical adventure island with geometric towers and a golden compass"
                className="w-full h-64 lg:h-72 object-cover rounded-lg border-2 border-light-outline-variant"
              />
            </div>
          </div>
        </section>

        {/* Four Realms Preview */}
        <section aria-label="Inside QuantaQuest" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
          {REALM_HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-md flex items-center gap-gutter-md"
            >
              <span
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center shrink-0 ${item.boxClass}`}
              >
                <span
                  className="material-symbols-outlined text-headline-md"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
              </span>
              <div className="flex flex-col">
                <h2 className="font-headline text-title-md text-light-on-surface">{item.title}</h2>
                <p className="font-body text-label-sm text-light-on-surface-variant">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <p className="text-center font-body text-label-sm text-light-on-surface-variant">
          Local demo mode: student accounts are saved in your browser using localStorage.
        </p>
      </main>
    </div>
  );
}
