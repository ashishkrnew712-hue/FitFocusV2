import React, { useEffect, useState } from 'react';
import { ChevronRight, Dumbbell, Activity, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { supabase } from '../supabaseClient';
import { getOfflineWorkouts } from '../hooks/useOfflineSync';
import './History.css';

export const History = () => {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            const offlineWorkouts = getOfflineWorkouts();
            let fetchedWorkouts = [];

            const { data: { user } } = await supabase.auth.getUser();
            if (user && navigator.onLine) {
                try {
                    const { data } = await supabase
                        .from('workouts')
                        .select('*')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false });

                    if (data) fetchedWorkouts = data;
                } catch (e) {
                    console.error("Network error fetching history", e);
                }
            }

            setWorkouts([...offlineWorkouts, ...fetchedWorkouts]);
        };

        fetchWorkouts();

        const handleSync = () => fetchWorkouts();
        window.addEventListener('workouts_synced', handleSync);
        return () => window.removeEventListener('workouts_synced', handleSync);
    }, []);

    return (
        <div className="history-page animate-fade-in">
            <header className="page-header">
                <h1>Workout History</h1>
            </header>

            <div className="history-filters">
                <button className="filter-pill active">All</button>
                <button className="filter-pill">Upper Body</button>
                <button className="filter-pill">Lower Body</button>
                <button className="filter-pill">Cardio</button>
            </div>

            <div className="history-list">
                <div className="history-month">
                    <h3 className="month-label">Your Sessions</h3>
                    {workouts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No workouts saved yet. Go crush one!</p>}

                    {workouts.map(workout => (
                        <Card key={workout.id} className="history-item" interactive>
                            <div className="history-icon bg-blue"><Dumbbell size={20} /></div>
                            <div className="history-details">
                                <h4>{workout.title}</h4>
                                <p>{Math.floor(workout.duration_seconds / 60)} min • {workout.total_volume_kg} kg</p>
                            </div>
                            <div className="history-date">
                                <span>{new Date(workout.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <ChevronRight size={16} />
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
