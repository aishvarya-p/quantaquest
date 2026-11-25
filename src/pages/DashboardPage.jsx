import AppHeader from '../components/AppHeader';
import AdventureProgressCard from '../components/dashboard/AdventureProgressCard';
import BadgeCaseCard from '../components/dashboard/BadgeCaseCard';
import LearningRealms from '../components/dashboard/LearningRealms';
import ThemeWorkshopCard from '../components/dashboard/ThemeWorkshopCard';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-light-background text-light-on-background">
      <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-page-margin py-gutter-xl flex flex-col gap-gutter-xl">
        <WelcomeBanner />

        <LearningRealms />

        <section
          aria-label="Adventure progress and rewards"
          className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg items-stretch"
        >
          <AdventureProgressCard />
          <BadgeCaseCard />
          <ThemeWorkshopCard />
        </section>
      </main>
    </div>
  );
}
