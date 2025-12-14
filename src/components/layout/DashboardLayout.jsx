import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-dashboard-bg text-dashboard-text font-sans selection:bg-dashboard-accent selection:text-white">
            <Sidebar />

            <main className="flex-1 min-w-0 overflow-y-auto h-screen relative">
                {/* Optional: Add TopBar here if needed, but Sidebar covers most nav needs */}
                <div className="p-6 md:p-10 max-w-7xl mx-auto pb-20">
                    <Outlet />
                </div>

                {/* Background Gradient Orbs for 'Refined Purple' vibe */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-dashboard-accent/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
