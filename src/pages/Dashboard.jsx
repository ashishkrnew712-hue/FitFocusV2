import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, Flame, ChevronRight, Plus, Dumbbell } from 'lucide-react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    return (
        <div className="dashboard-page animate-fade-in">
            <header className="dashboard-header">
                <div>
                    <h1 className="greeting">Hello, {user ? user.email.split('@')[0] : 'Athlete'}</h1>
                    <p className="date-text">Ready to crush it today?</p>
                </div>
                <div className="avatar">A</div>
            </header>

            <section className="stats-grid animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Card className="stat-card stat-streak">
                    <div className="stat-icon-wrapper"><Flame size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">5<small>Days</small></span>
                        <span className="stat-label">Current Streak</span>
                    </div>
                </Card>
                <Card className="stat-card stat-workouts">
                    <div className="stat-icon-wrapper"><Dumbbell size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-value">12</span>
                        <span className="stat-label">This Month</span>
                    </div>
                </Card>
            </section>

            <section className="quick-action-section animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <Card
                    variant="glass"
                    interactive
                    className="quick-start-card"
                    onClick={() => navigate('/workout')}
                >
                    <div className="quick-start-content">
                        <div className="quick-start-icon"><Plus size={32} /></div>
                        <div className="quick-start-text">
                            <h2>Start Workout</h2>
                            <p>Log a new session</p>
                        </div>
                    </div>
                </Card>
            </section>

            <section className="recent-activity animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="section-header">
                    <h2>Recent Activity</h2>
                    <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>View All</Button>
                </div>

                <div className="activity-list">
                    <Card className="activity-item" interactive>
                        <div className="activity-icon bg-blue"><Dumbbell size={18} /></div>
                        <div className="activity-details">
                            <h3>Upper Body Power</h3>
                            <p>Yesterday • 45 min</p>
                        </div>
                        <div className="activity-action"><ChevronRight size={16} /></div>
                    </Card>
                    <Card className="activity-item" interactive>
                        <div className="activity-icon bg-orange"><Activity size={18} /></div>
                        <div className="activity-details">
                            <h3>HIIT Cardio</h3>
                            <p>Mon, Oct 12 • 30 min</p>
                        </div>
                        <div className="activity-action"><ChevronRight size={16} /></div>
                    </Card>
                </div>
            </section>
        </div>
    );
};
