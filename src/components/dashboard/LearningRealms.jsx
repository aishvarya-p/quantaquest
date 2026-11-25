import { Link } from 'react-router-dom';

const REALMS = [
  {
    id: 'math-challenge',
    to: '/challenge',
    title: 'Math Challenge',
    badge: '+50 XP / quest',
    badgeTabular: true,
    description: 'Battle tricky word riddles and timed puzzle waves to level up fast.',
    cta: 'Start Challenge',
    icon: 'swords',
    cardClasses:
      'hover:border-realm-challenge focus-visible:outline-realm-challenge',
    iconBoxClasses:
      'bg-realm-challenge-soft text-on-realm-challenge-soft border-realm-challenge',
    badgeClasses: 'bg-realm-challenge-soft text-on-realm-challenge-soft',
    ctaTextClasses: 'text-realm-challenge',
  },
  {
    id: 'smart-calculator',
    to: '/calculator',
    title: 'Smart Calculator',
    badge: 'Step-by-step',
    badgeTabular: false,
    description: 'Test equations and see visual step-by-step breakdowns as you explore.',
    cta: 'Open Calculator',
    icon: 'calculate',
    cardClasses:
      'hover:border-realm-calculator focus-visible:outline-realm-calculator',
    iconBoxClasses:
      'bg-realm-calculator-soft text-on-realm-calculator-soft border-realm-calculator',
    badgeClasses: 'bg-realm-calculator-soft text-on-realm-calculator-soft',
    ctaTextClasses: 'text-realm-calculator',
  },
  {
    id: 'tables-practice',
    to: '/tables',
    title: 'Tables Practice',
    badge: 'Up to 12×12',
    badgeTabular: true,
    description: 'Sprint through multiplication and division decks to build lightning speed.',
    cta: 'Practice Tables',
    icon: 'grid_on',
    cardClasses:
      'hover:border-realm-tables focus-visible:outline-realm-tables',
    iconBoxClasses:
      'bg-realm-tables-soft text-on-realm-tables-soft border-realm-tables',
    badgeClasses: 'bg-realm-tables-soft text-on-realm-tables-soft',
    ctaTextClasses: 'text-realm-tables',
  },
  {
    id: 'shape-explorer',
    to: '/shapes',
    title: 'Shape Explorer',
    badge: '2D & 3D Lab',
    badgeTabular: false,
    description: 'Rotate polyhedra, measure angles, and construct geometric wonders.',
    cta: 'Explore Shapes',
    icon: 'pentagon',
    cardClasses:
      'hover:border-realm-geometry focus-visible:outline-realm-geometry',
    iconBoxClasses:
      'bg-realm-geometry-soft text-on-realm-geometry-soft border-realm-geometry',
    badgeClasses: 'bg-realm-geometry-soft text-on-realm-geometry-soft',
    ctaTextClasses: 'text-realm-geometry',
  },
];

export default function LearningRealms() {
  return (
    <section aria-labelledby="realms-heading" className="flex flex-col gap-gutter-md">
      <div className="flex flex-wrap items-baseline justify-between gap-gutter-sm">
        <h2 id="realms-heading" className="font-headline text-headline-lg text-light-on-surface">
          Choose Your Learning Realm
        </h2>
        <p className="font-body text-body-md text-light-on-surface-variant">
          Pick an activity to earn XP and discover new badges
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-lg items-stretch">
        {REALMS.map((realm) => (
          <Link
            key={realm.id}
            id={realm.id}
            to={realm.to}
            className={`group h-full bg-light-surface-container-lowest rounded-xl border-2 border-light-outline-variant tile-shadow p-gutter-lg flex flex-col justify-between gap-gutter-md hover:-translate-y-0.5 active:translate-y-0.5 transition-transform duration-state-change ease-state-change focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${realm.cardClasses}`}
          >
            <div className="flex flex-col gap-gutter-md">
              <header className="flex items-start justify-between gap-gutter-sm">
                <span
                  className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center shrink-0 ${realm.iconBoxClasses}`}
                >
                  <span
                    className="material-symbols-outlined text-headline-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                    aria-hidden="true"
                  >
                    {realm.icon}
                  </span>
                </span>
                <span
                  className={`font-label text-label-sm px-2.5 py-1 rounded-full ${realm.badgeClasses} ${
                    realm.badgeTabular ? 'tabular-nums' : ''
                  }`}
                >
                  {realm.badge}
                </span>
              </header>
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-headline text-headline-md text-light-on-surface">
                  {realm.title}
                </h3>
                <p className="font-body text-body-md text-light-on-surface-variant text-pretty">
                  {realm.description}
                </p>
              </div>
            </div>
            <footer className="pt-gutter-sm border-t border-light-outline-variant flex items-center justify-between">
              <span className={`font-label text-label-lg ${realm.ctaTextClasses}`}>{realm.cta}</span>
              <span
                className={`material-symbols-outlined text-title-lg ${realm.ctaTextClasses} group-hover:translate-x-1 transition-transform duration-state-change`}
                aria-hidden="true"
              >
                arrow_forward
              </span>
            </footer>
          </Link>
        ))}
      </div>
    </section>
  );
}
