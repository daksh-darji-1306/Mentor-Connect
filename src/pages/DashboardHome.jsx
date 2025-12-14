import React from 'react';
import { useAuth } from '../context/AuthContext';
import MentorDashboard from './MentorDashboard';
import MenteeDashboard from './MenteeDashboard';

const DashboardHome = () => {
    const { user } = useAuth();

    // Default to Mentee if role is missing/loading (safe fallback)
    const role = user?.role || 'mentee';

    if (role === 'mentor') {
        return <MentorDashboard />;
    }

    return <MenteeDashboard />;
};

export default DashboardHome;
