import { useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const saveOfflineWorkout = (workout) => {
    const existing = JSON.parse(localStorage.getItem('offline_workouts') || '[]');
    existing.push({ ...workout, _offlineId: Date.now() });
    localStorage.setItem('offline_workouts', JSON.stringify(existing));
};

export const getOfflineWorkouts = () => {
    return JSON.parse(localStorage.getItem('offline_workouts') || '[]');
};

export const useOfflineSync = () => {
    useEffect(() => {
        const syncWorkouts = async () => {
            if (!navigator.onLine) return;

            const offline = getOfflineWorkouts();
            if (offline.length === 0) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // Wait until authenticated

            const workoutsToSync = offline.map(({ _offlineId, ...w }) => ({ ...w, user_id: user.id }));

            const { error } = await supabase.from('workouts').insert(workoutsToSync);

            if (!error) {
                localStorage.removeItem('offline_workouts');
                console.log('Successfully synced offline workouts!', workoutsToSync.length);
                window.dispatchEvent(new Event('workouts_synced'));
            }
        };

        // Try to sync on mount
        syncWorkouts();

        // Try to sync when the browser/app signals network is back
        window.addEventListener('online', syncWorkouts);
        return () => window.removeEventListener('online', syncWorkouts);
    }, []);
};
