import React from 'react';
import { Search, Plus, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import './Catalogue.css';

export const Catalogue = () => {
    return (
        <div className="catalogue-page animate-fade-in">
            <header className="page-header">
                <h1>Exercises</h1>
                <Button variant="surface" size="sm" icon={<Plus size={18} />}></Button>
            </header>

            <div className="search-section">
                <Input placeholder="Search exercises..." icon={<Search />} />
                <Button variant="surface" className="filter-btn"><Filter size={20} /></Button>
            </div>

            <div className="exercise-list">
                <Card className="exercise-list-item" interactive>
                    <div className="exercise-img"><img src="https://images.unsplash.com/photo-1544212503-4f9e1e360d84?w=56&h=56&fit=crop&q=80" alt="Bench Press" /></div>
                    <div className="exercise-info">
                        <h3>Bench Press</h3>
                        <p>Chest • Barbell</p>
                    </div>
                </Card>
                <Card className="exercise-list-item" interactive>
                    <div className="exercise-img"><img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=56&h=56&fit=crop&q=80" alt="Squat" /></div>
                    <div className="exercise-info">
                        <h3>Barbell Squat</h3>
                        <p>Legs • Barbell</p>
                    </div>
                </Card>
                <Card className="exercise-list-item" interactive>
                    <div className="exercise-img"><img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=56&h=56&fit=crop&q=80" alt="Deadlift" /></div>
                    <div className="exercise-info">
                        <h3>Deadlift</h3>
                        <p>Back • Barbell</p>
                    </div>
                </Card>
                <Card className="exercise-list-item" interactive>
                    <div className="exercise-img"><img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=56&h=56&fit=crop&q=80" alt="Pull up" /></div>
                    <div className="exercise-info">
                        <h3>Pull Up</h3>
                        <p>Back • Bodyweight</p>
                    </div>
                </Card>
                <Card className="exercise-list-item" interactive>
                    <div className="exercise-img"><img src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=56&h=56&fit=crop&q=80" alt="Dumbbell Curl" /></div>
                    <div className="exercise-info">
                        <h3>Dumbbell Curl</h3>
                        <p>Arms • Dumbbell</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
