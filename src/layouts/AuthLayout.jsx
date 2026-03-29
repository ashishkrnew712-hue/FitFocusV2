import React from 'react';
import { Outlet } from 'react-router-dom';
import './AuthLayout.css';

export const AuthLayout = () => {
    return (
        <div className="auth-container">
            <main className="auth-content animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
};
