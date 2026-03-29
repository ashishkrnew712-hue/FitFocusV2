import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { supabase } from '../supabaseClient';
import { saveOfflineWorkout } from '../hooks/useOfflineSync';
import './Workout.css';

export const Workout = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState(true);
    const [time, setTime] = useState(0);
    const [showFinishConfirm, setShowFinishConfirm] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime(time => time + 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    const formatTime = (seconds) => {
        const getSeconds = `0${(seconds % 60)}`.slice(-2);
        const minutes = `${Math.floor(seconds / 60)}`;
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        return `${getHours !== '00' ? getHours + ':' : ''}${getMinutes}:${getSeconds}`;
    };

    const saveWorkout = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const workoutData = {
            title: 'Upper Body Power',
            duration_seconds: time,
            total_volume_kg: 4250,
            created_at: new Date().toISOString()
        };

        if (user && navigator.onLine) {
            try {
                const { error } = await supabase.from('workouts').insert([
                    { ...workoutData, user_id: user.id }
                ]);
                if (error) throw error;
            } catch (err) {
                saveOfflineWorkout(workoutData);
            }
        } else {
            saveOfflineWorkout(workoutData);
        }
        navigate('/history');
    };

    if (showFinishConfirm) {
        return (
            <div className="workout-page animate-fade-in finish-confirm-page">
                <div className="finish-content">
                    <div className="trophy-icon"><Check size={64} /></div>
                    <h1>Great Job!</h1>
                    <p>You've completed your workout.</p>
                    <div className="summary-stats">
                        <div className="stat">
                            <span className="label">Duration</span>
                            <span className="value">{formatTime(time)}</span>
                        </div>
                        <div className="stat">
                            <span className="label">Volume</span>
                            <span className="value">4,250 kg</span>
                        </div>
                    </div>
                    <div className="finish-actions">
                        <Button size="lg" fullWidth onClick={saveWorkout}>Save Workout</Button>
                        <Button variant="ghost" fullWidth onClick={() => setShowFinishConfirm(false)}>Back to Workout</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="workout-page animate-fade-in">
            <header className="workout-header">
                <button className="back-btn" onClick={() => navigate(-1)}><ChevronLeft /></button>
                <div className="timer" onClick={() => setIsActive(!isActive)}>
                    {formatTime(time)} {isActive && <span className="pulse-dot"></span>}
                </div>
                <Button variant="primary" size="sm" onClick={() => setShowFinishConfirm(true)}>Finish</Button>
            </header>

            <div className="workout-content">
                <h2 className="workout-title">Upper Body Power</h2>

                <Card className="exercise-card">
                    <div className="exercise-header">
                        <h3>Bench Press</h3>
                        <span className="exercise-menu">...</span>
                    </div>

                    <div className="sets-container">
                        <div className="set-header">
                            <span>Set</span>
                            <span>kg</span>
                            <span>Reps</span>
                            <span><Check size={16} /></span>
                        </div>

                        {[1, 2, 3].map((setNum) => (
                            <div key={setNum} className="set-row">
                                <div className="set-number">{setNum}</div>
                                <div className="set-input"><Input placeholder="60" type="number" /></div>
                                <div className="set-input"><Input placeholder="10" type="number" /></div>
                                <div className="set-check"><button className="check-btn"><Check size={16} /></button></div>
                            </div>
                        ))}
                        <Button variant="ghost" className="add-set-btn">+ Add Set</Button>
                    </div>
                </Card>

                <Card className="exercise-card">
                    <div className="exercise-header">
                        <h3>Incline Dumbbell Press</h3>
                        <span className="exercise-menu">...</span>
                    </div>
                    <div className="sets-container">
                        <div className="set-header">
                            <span>Set</span>
                            <span>kg</span>
                            <span>Reps</span>
                            <span><Check size={16} /></span>
                        </div>
                        <div className="set-row">
                            <div className="set-number">1</div>
                            <div className="set-input"><Input placeholder="30" type="number" /></div>
                            <div className="set-input"><Input placeholder="12" type="number" /></div>
                            <div className="set-check"><button className="check-btn"><Check size={16} /></button></div>
                        </div>
                    </div>
                    <Button variant="ghost" className="add-set-btn" style={{ marginTop: '0.5rem' }}>+ Add Set</Button>
                </Card>
            </div>

            <div className="add-exercise-container">
                <Button variant="surface" size="lg" fullWidth icon={<Plus size={18} />} onClick={() => navigate('/catalogue')}>
                    Add Exercise
                </Button>
            </div>
        </div>
    );
};
