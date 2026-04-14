import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import MentorDashboard from './MentorDashboard';
import MenteeDashboard from './MenteeDashboard';

const DashboardHome = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!user.profile_data?.onboardingCompleted) {
        return <Navigate to="/onboarding" replace />;
    }

    const role = user?.role;

    if (role === 'mentor') {
        return <MentorDashboard />;
    }

    return <MenteeDashboard />;
};

export default DashboardHome;
