import TopNavigation from './TopNavigation';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <TopNavigation />

            <main className="container mx-auto max-w-7xl p-6 md:p-8 pb-20 relative z-10">
                <Outlet />
            </main>

            {/* Subtle Texture for "Paper" feel instead of heavy colorful orbs */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-0 mix-blend-soft-light"></div>
        </div>
    );
};

export default DashboardLayout;
