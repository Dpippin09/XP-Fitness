import React, { useState } from 'react';

interface WorkoutFormProps {
    onWorkoutSubmit: (workout: {
        weightLifted: number;
        repetitions: number;
        workoutDuration: number;
        gymVisits: number;
    }) => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onWorkoutSubmit }) => {
    const [formData, setFormData] = useState({
        weightLifted: '',
        repetitions: '',
        workoutDuration: '',
        exercise: ''
    });

    const [quickActions, setQuickActions] = useState({
        checkedIn: false,
        workoutStarted: false,
        startTime: null as Date | null
    });

    // Quick check-in to gym
    const handleGymCheckIn = () => {
        setQuickActions(prev => ({ ...prev, checkedIn: true }));
        // This would automatically add 1 gym visit
        onWorkoutSubmit({
            weightLifted: 0,
            repetitions: 0,
            workoutDuration: 0,
            gymVisits: 1
        });
    };

    // Start workout timer
    const handleStartWorkout = () => {
        setQuickActions(prev => ({
            ...prev,
            workoutStarted: true,
            startTime: new Date()
        }));
    };

    // End workout and calculate duration
    const handleEndWorkout = () => {
        if (quickActions.startTime) {
            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - quickActions.startTime.getTime()) / (1000 * 60));
            
            onWorkoutSubmit({
                weightLifted: parseInt(formData.weightLifted) || 0,
                repetitions: parseInt(formData.repetitions) || 0,
                workoutDuration: duration,
                gymVisits: 0 // Already counted in check-in
            });

            // Reset form
            setFormData({
                weightLifted: '',
                repetitions: '',
                workoutDuration: '',
                exercise: ''
            });
            setQuickActions({
                checkedIn: false,
                workoutStarted: false,
                startTime: null
            });
        }
    };

    // Quick preset workouts
    const handlePresetWorkout = (preset: string) => {
        const presets = {
            'light-cardio': { weightLifted: 0, repetitions: 0, workoutDuration: 30, gymVisits: 1 },
            'strength-training': { weightLifted: 200, repetitions: 50, workoutDuration: 45, gymVisits: 1 },
            'heavy-lifting': { weightLifted: 400, repetitions: 30, workoutDuration: 60, gymVisits: 1 },
            'hiit': { weightLifted: 50, repetitions: 100, workoutDuration: 25, gymVisits: 1 }
        };
        
        onWorkoutSubmit(presets[preset as keyof typeof presets]);
    };

    return (
        <div className="workout-form">
            <h3>🏋️ Quick Workout Logging</h3>
            
            {/* Quick Actions */}
            <div className="quick-actions">
                <h4>⚡ Quick Actions</h4>
                <div className="action-buttons-grid">
                    <button 
                        onClick={handleGymCheckIn}
                        className={`quick-btn ${quickActions.checkedIn ? 'checked-in' : ''}`}
                        disabled={quickActions.checkedIn}
                    >
                        {quickActions.checkedIn ? '✅ Checked In' : '📍 Check In to Gym'}
                    </button>
                    
                    <button 
                        onClick={handleStartWorkout}
                        className={`quick-btn ${quickActions.workoutStarted ? 'started' : ''}`}
                        disabled={quickActions.workoutStarted}
                    >
                        {quickActions.workoutStarted ? '⏱️ Workout Active' : '▶️ Start Workout'}
                    </button>
                    
                    {quickActions.workoutStarted && (
                        <button onClick={handleEndWorkout} className="quick-btn end-workout">
                            🏁 End Workout
                        </button>
                    )}
                </div>
            </div>

            {/* Preset Workouts */}
            <div className="preset-workouts">
                <h4>🎯 Quick Workout Presets</h4>
                <div className="preset-grid">
                    <button onClick={() => handlePresetWorkout('light-cardio')} className="preset-btn cardio">
                        🏃 Light Cardio (30min)
                    </button>
                    <button onClick={() => handlePresetWorkout('strength-training')} className="preset-btn strength">
                        💪 Strength Training (45min)
                    </button>
                    <button onClick={() => handlePresetWorkout('heavy-lifting')} className="preset-btn heavy">
                        🏋️ Heavy Lifting (60min)
                    </button>
                    <button onClick={() => handlePresetWorkout('hiit')} className="preset-btn hiit">
                        🔥 HIIT Workout (25min)
                    </button>
                </div>
            </div>

            {/* Manual Input Form */}
            <div className="manual-input">
                <h4>📝 Manual Entry</h4>
                <div className="form-grid">
                    <div className="input-group">
                        <label>💪 Weight Lifted (lbs)</label>
                        <input
                            type="number"
                            value={formData.weightLifted}
                            onChange={(e) => setFormData(prev => ({ ...prev, weightLifted: e.target.value }))}
                            placeholder="e.g., 135"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>🔄 Repetitions</label>
                        <input
                            type="number"
                            value={formData.repetitions}
                            onChange={(e) => setFormData(prev => ({ ...prev, repetitions: e.target.value }))}
                            placeholder="e.g., 50"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>⏱️ Duration (minutes)</label>
                        <input
                            type="number"
                            value={formData.workoutDuration}
                            onChange={(e) => setFormData(prev => ({ ...prev, workoutDuration: e.target.value }))}
                            placeholder="e.g., 45"
                        />
                    </div>
                    
                    <div className="input-group">
                        <label>🏋️ Exercise Type</label>
                        <select 
                            value={formData.exercise}
                            onChange={(e) => setFormData(prev => ({ ...prev, exercise: e.target.value }))}
                        >
                            <option value="">Select exercise</option>
                            <option value="cardio">Cardio</option>
                            <option value="weights">Weight Training</option>
                            <option value="bodyweight">Bodyweight</option>
                            <option value="sports">Sports</option>
                            <option value="yoga">Yoga/Stretching</option>
                        </select>
                    </div>
                </div>
                
                <button 
                    onClick={() => onWorkoutSubmit({
                        weightLifted: parseInt(formData.weightLifted) || 0,
                        repetitions: parseInt(formData.repetitions) || 0,
                        workoutDuration: parseInt(formData.workoutDuration) || 0,
                        gymVisits: 1
                    })}
                    className="submit-btn"
                >
                    📊 Log Workout
                </button>
            </div>
        </div>
    );
};

export default WorkoutForm;
