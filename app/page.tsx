import AnalyticsMenteeDashboard from '@/components/dashboard/analytics-mentee-dashboard';
import { Sidebar } from '@/components/dashboard/sidebar';

export const metadata = {
  title: 'Dashboard | Metric Flow',
  description: 'Your mentorship analytics dashboard - track progress, sessions, and learning resources',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative">
      <Sidebar />
      <main className="ml-64 p-8 relative z-10">
        <AnalyticsMenteeDashboard />
      </main>
    </div>
  );
}
