import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../supabaseClient';
import './Login.css';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
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
        setLoading(true);
        setError('');
        const { error } = await supabase.auth.signUp({
            email,
            password,
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

        // This triggers the web-based OAuth flow
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-header animate-slide-up">
                <div className="logo-container">
                    <Activity size={40} className="logo-icon animate-pulse" />
                </div>
                <h1 className="login-title">FitFocus</h1>
                <p className="login-subtitle">Ultimate Fitness Tracker</p>
            </div>

            <Card variant="glass" className="login-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <form onSubmit={handleLogin} className="login-form">
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
                    <div className="forgot-password">
                        <a href="#">Forgot password?</a>
                    </div>
                    <Button type="submit" fullWidth size="lg" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Sign In'}
                    </Button>
                    <Button type="button" variant="ghost" fullWidth onClick={handleSignUp} disabled={loading}>Create Account</Button>

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
