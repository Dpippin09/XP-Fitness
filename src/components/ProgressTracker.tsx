import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported

interface ProgressTrackerProps {
    weightLifted: number;
    repetitions: number;
    workoutDuration: number; // in minutes
    gymVisits: number; // Number of times the user has visited the gym
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ weightLifted, repetitions, workoutDuration, gymVisits }) => {
    const [points, setPoints] = useState(0);

    // Calculate points based on gym visits
    useEffect(() => {
        const newPoints = gymVisits * 10; // Example: 10 points per gym visit
        setPoints(newPoints);
    }, [gymVisits]);

    return (
        <div>
            <h2>Workout Progress</h2>
            <p>Weight Lifted: {weightLifted} lbs</p>
            <p>Repetitions: {repetitions}</p>
            <p>Workout Duration: {workoutDuration} minutes</p>
            <p>Gym Visits: {gymVisits}</p>
            <h3>Points Earned: {points}</h3>
        </div>
    );
};

export default ProgressTracker;