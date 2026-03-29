import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { supabase } from './supabaseClient';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Workout } from './pages/Workout';
import { Catalogue } from './pages/Catalogue';
import { History } from './pages/History';
import { Progress } from './pages/Progress';
import { useOfflineSync } from './hooks/useOfflineSync';
import './App.css';

// Placeholder Components for routes until they are implemented
const PlaceholderPage = ({ title }) => (
  <div className="animate-fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: 'var(--primary)', marginTop: '2rem' }}>{title}</h1>
    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Coming soon...</p>
  </div>
);

function App() {
  useOfflineSync();

  useEffect(() => {
    CapacitorApp.addListener('appUrlOpen', async (event) => {
      try {
        const url = new URL(event.url);

        if (url.hash && url.hash.includes('access_token')) {
          await supabase.auth.getSessionFromUrl({ url: event.url });
        }

        if (url.searchParams && url.searchParams.has('code')) {
          await supabase.auth.exchangeCodeForSession(url.searchParams.get('code'));
        }
      } catch (e) {
        console.error('Deep link intercept error:', e);
      }
    });

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/history" element={<History />} />
          <Route path="/progress" element={<Progress />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
