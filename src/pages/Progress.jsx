import React from 'react';
import { Camera, Activity } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import './Progress.css';

export const Progress = () => {
    return (
        <div className="progress-page animate-fade-in">
            <header className="page-header">
                <h1>Progress</h1>
            </header>

            <section className="weight-tracker">
                <div className="section-header">
                    <h2>Weight Tracker</h2>
                    <Button variant="ghost" size="sm">+ Log Weight</Button>
                </div>

                <Card className="weight-card">
                    <div className="weight-stats">
                        <div className="weight-stat-item">
                            <span className="label">Current</span>
                            <span className="value">78.5 <small>kg</small></span>
                        </div>
                        <div className="weight-stat-item">
                            <span className="label">Target</span>
                            <span className="value">75.0 <small>kg</small></span>
                        </div>
                        <div className="weight-stat-item highlight">
                            <span className="label">To Go</span>
                            <span className="value">3.5 <small>kg</small></span>
                        </div>
                    </div>
                    <div className="chart-placeholder">
                        <Activity size={48} className="chart-icon" />
                        <p>Weight chart visualization</p>
                    </div>
                </Card>
            </section>

            <section className="progress-photos">
                <div className="section-header">
                    <h2>Photos</h2>
                    <Button variant="ghost" size="sm" icon={<Camera size={16} />}></Button>
                </div>

                <div className="photo-grid">
                    <div className="photo-item empty">
                        <Button variant="ghost" className="add-photo-btn">
                            <Camera size={24} />
                            <span>Add front</span>
                        </Button>
                    </div>
                    <div className="photo-item empty">
                        <Button variant="ghost" className="add-photo-btn">
                            <Camera size={24} />
                            <span>Add side</span>
                        </Button>
                    </div>
                    <div className="photo-item empty">
                        <Button variant="ghost" className="add-photo-btn">
                            <Camera size={24} />
                            <span>Add back</span>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
