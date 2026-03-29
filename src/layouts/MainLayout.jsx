import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Activity, List, Clock, LineChart } from 'lucide-react';
import './MainLayout.css';

export const MainLayout = () => {
    const location = useLocation();
    // Don't show bottom nav on workout session since it should be full screen usually
    const isWorkoutSession = location.pathname.includes('/workout/session');

    const navItems = [
        { to: '/dashboard', icon: <Home size={24} />, label: 'Home' },
        { to: '/catalogue', icon: <List size={24} />, label: 'Exercises' },
        { to: '/workout', icon: <Activity size={24} />, label: 'Workout', primary: true },
        { to: '/history', icon: <Clock size={24} />, label: 'History' },
        { to: '/progress', icon: <LineChart size={24} />, label: 'Progress' },
    ];

    return (
        <div className="layout-container">
            <main className="layout-content">
                <Outlet />
            </main>
            {!isWorkoutSession && (
                <nav className="bottom-nav animate-slide-up">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${item.primary ? 'primary-item' : ''}`}
                        >
                            {item.icon}
                            <span className="nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            )}
        </div>
    );
};
