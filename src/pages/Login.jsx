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

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            });

            if (authError) {
                setError(authError.message);
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection error. Please check your internet.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            setError('Please enter both an email and a password to create an account.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: signUpError } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            });

            if (signUpError) {
                setError(signUpError.message);
            } else {
                setError('Success! You can now sign in.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Connection error. Please check your internet.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            // Trigger the web-based OAuth flow
            const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'com.fitfocus.app://login-callback'
                }
            });

            if (googleError) {
                setError(googleError.message);
                setLoading(false);
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError('OAuth failed. Please try again or use email.');
            setLoading(false);
        }

        // Add a safety timeout in case the deep link completely fails to return a session
        setTimeout(() => {
            setLoading((prev) => {
                if (prev) {
                    console.warn('Login timed out after 120s');
                    setError("Login took too long and was aborted. Please try again.");
                }
                return false;
            });
        }, 120000);
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
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
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
