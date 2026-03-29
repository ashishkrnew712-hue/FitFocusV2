import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Activity, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../supabaseClient';
import './Login.css';

export const Login = () => {
    const navigate = useNavigate();
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Automatically push the user to dashboard if Supabase successfully authenticates them (e.g. returning from deep link)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                navigate('/dashboard');
            }
        });

        // Also check immediately when the page loads
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate('/dashboard');
        });

        return () => authListener.subscription.unsubscribe();
    }, [navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (isSignUpMode) {
            await handleSignUp();
        } else {
            await handleLogin();
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            setError('Please enter both an email and a password to create an account.');
            return;
        }

        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName
                }
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setError('Check your email for the login link! Or try signing in if auto-confirmed.');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        // Trigger the web-based OAuth flow
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'com.fitfocus.app://login-callback'
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }

        // Add a safety timeout in case the deep link completely fails to return a session
        setTimeout(() => {
            setLoading((prev) => {
                if (prev) setError("Login timed out or was cancelled. Please try again.");
                return false;
            });
        }, 15000);
    };

    return (
        <div className="login-page">
            <div className="login-header animate-slide-up">
                <div className="logo-container">
                    <Activity size={40} className="logo-icon animate-pulse" />
                </div>
                <h1 className="login-title">FitFocus</h1>
                <p className="login-subtitle">
                    {isSignUpMode ? 'Create your account' : 'Ultimate Fitness Tracker'}
                </p>
            </div>

            <Card variant="glass" className="login-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={onSubmit} className="login-form">
                    {isSignUpMode && (
                        <Input
                            type="text"
                            placeholder="Full Name (optional)"
                            icon={<User />}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    )}
                    <Input
                        type="email"
                        placeholder="Email Address"
                        icon={<Mail />}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        icon={<Lock />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={error}
                        required
                    />
                    {!isSignUpMode && (
                        <div className="forgot-password">
                            <a href="#">Forgot password?</a>
                        </div>
                    )}
                    <Button type="submit" fullWidth size="lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Processing...' : (isSignUpMode ? 'Create Account' : 'Sign In')}
                    </Button>

                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {isSignUpMode ? "Already have an account? " : "Don't have an account? "}
                        <span
                            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
                            onClick={() => { setIsSignUpMode(!isSignUpMode); setError(''); }}
                        >
                            {isSignUpMode ? 'Sign In' : 'Sign Up'}
                        </span>
                    </div>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <Button type="button" variant="surface" fullWidth onClick={handleGoogleLogin} disabled={loading}>
                        Sign in with Google
                    </Button>
                </form>
            </Card>
        </div>
    );
};
