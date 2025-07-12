import React, { useState, useEffect } from 'react';

interface ProgressTrackerProps {
    weightLifted: number;
    repetitions: number;
    workoutDuration: number; // in minutes
    gymVisits: number; // Number of times the user has visited the gym
    onXPGained: (xp: number) => void; // Callback to update total XP
}

interface WorkoutSession {
    date: string;
    xpEarned: number;
    activities: string[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
    weightLifted, 
    repetitions, 
    workoutDuration, 
    gymVisits, 
    onXPGained 
}) => {
    const [sessionXP, setSessionXP] = useState(0);
    const [recentActivities, setRecentActivities] = useState<string[]>([]);

    // Calculate XP based on different workout metrics
    useEffect(() => {
        const activities: string[] = [];
        let totalXP = 0;

        // XP for gym visits (base reward)
        const gymXP = gymVisits * 20;
        totalXP += gymXP;
        if (gymVisits > 0) {
            activities.push(`🏋️ Gym Visits: +${gymXP} XP`);
        }

        // XP for weight lifted (1 XP per 10 lbs)
        const weightXP = Math.floor(weightLifted / 10) * 5;
        totalXP += weightXP;
        if (weightLifted > 0) {
            activities.push(`💪 Weight Lifted: +${weightXP} XP`);
        }

        // XP for repetitions (1 XP per 5 reps)
        const repXP = Math.floor(repetitions / 5) * 3;
        totalXP += repXP;
        if (repetitions > 0) {
            activities.push(`🔄 Repetitions: +${repXP} XP`);
        }

        // XP for workout duration (2 XP per minute)
        const durationXP = workoutDuration * 2;
        totalXP += durationXP;
        if (workoutDuration > 0) {
            activities.push(`⏱️ Duration: +${durationXP} XP`);
        }

        // Bonus XP for completing a full workout (all metrics > 0)
        if (weightLifted > 0 && repetitions > 0 && workoutDuration > 0 && gymVisits > 0) {
            const bonusXP = 50;
            totalXP += bonusXP;
            activities.push(`🎯 Complete Workout Bonus: +${bonusXP} XP`);
        }

        setSessionXP(totalXP);
        setRecentActivities(activities);
        onXPGained(totalXP);
    }, [weightLifted, repetitions, workoutDuration, gymVisits, onXPGained]);

    return (
        <div className="progress-tracker">
            <h2>🏋️ Current Workout Session</h2>
            
            <div className="workout-stats">
                <div className="stat-item">
                    <span className="stat-label">Weight Lifted:</span>
                    <span className="stat-value">{weightLifted} lbs</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Repetitions:</span>
                    <span className="stat-value">{repetitions}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Duration:</span>
                    <span className="stat-value">{workoutDuration} minutes</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Gym Visits:</span>
                    <span className="stat-value">{gymVisits}</span>
                </div>
            </div>

            <div className="xp-breakdown">
                <h3>⭐ XP Breakdown</h3>
                {recentActivities.length > 0 ? (
                    <ul className="activity-list">
                        {recentActivities.map((activity, index) => (
                            <li key={index}>{activity}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Start working out to earn XP!</p>
                )}
                <div className="session-total">
                    <strong>Session Total: {sessionXP} XP</strong>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;