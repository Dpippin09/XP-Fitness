import React, { useState, useEffect } from 'react';
import ProgressTracker from './components/ProgressTracker';
import LevelSystem from './components/LevelSystem';
import WeeklyChallenges from './components/WeeklyChallenges';
import WorkoutForm from './components/WorkoutForm';
import AutoTracking from './components/AutoTracking';

const App: React.FC = () => {
  // Game state
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [challengeXP, setChallengeXP] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  
  // Sample workout data (you can later replace this with user input)
  const [workoutData, setWorkoutData] = useState({
    weightLifted: 0,
    repetitions: 0,
    workoutDuration: 0,
    gymVisits: 0
  });

  // Calculate level based on total XP (100 XP per level)
  useEffect(() => {
    const newLevel = Math.floor((totalXP + challengeXP) / 100) + 1;
    setLevel(newLevel);
  }, [totalXP, challengeXP]);

  // Handle XP gained from workouts
  const handleXPGained = (sessionXP: number) => {
    // In a real app, you'd save this to localStorage or a database
    setTotalXP(sessionXP);
  };

  // Handle challenge completion
  const handleChallengeCompleted = (xp: number, challengeTitle: string) => {
    if (!completedChallenges.includes(challengeTitle)) {
      setChallengeXP(prev => prev + xp);
      setCompletedChallenges(prev => [...prev, challengeTitle]);
      // You could add a notification here
      console.log(`🎉 Challenge "${challengeTitle}" completed! +${xp} XP`);
    }
  };

  // Handle workout submission from form
  const handleWorkoutSubmit = (newWorkout: {
    weightLifted: number;
    repetitions: number;
    workoutDuration: number;
    gymVisits: number;
  }) => {
    setWorkoutData(prev => ({
      weightLifted: prev.weightLifted + newWorkout.weightLifted,
      repetitions: prev.repetitions + newWorkout.repetitions,
      workoutDuration: prev.workoutDuration + newWorkout.workoutDuration,
      gymVisits: prev.gymVisits + newWorkout.gymVisits
    }));
  };

  const resetProgress = () => {
    setWorkoutData({
      weightLifted: 0,
      repetitions: 0,
      workoutDuration: 0,
      gymVisits: 0
    });
    setTotalXP(0);
    setChallengeXP(0);
    setCompletedChallenges([]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏋️ XP Fitness - Level Up Your Workouts!</h1>
        <p>Turn your fitness journey into an epic game</p>
      </header>
      
      <main className="app-main">
        <LevelSystem currentXP={totalXP + challengeXP} level={level} />
        
        <WeeklyChallenges 
          workoutData={workoutData}
          onChallengeCompleted={handleChallengeCompleted}
        />
        
        <WorkoutForm onWorkoutSubmit={handleWorkoutSubmit} />
        
        <AutoTracking onAutoWorkout={handleWorkoutSubmit} />
        
        <ProgressTracker
          weightLifted={workoutData.weightLifted}
          repetitions={workoutData.repetitions}
          workoutDuration={workoutData.workoutDuration}
          gymVisits={workoutData.gymVisits}
          onXPGained={handleXPGained}
        />
        
        <div className="action-buttons">
          <button onClick={() => handleWorkoutSubmit({
            weightLifted: 135,
            repetitions: 12,
            workoutDuration: 45,
            gymVisits: 1
          })} className="workout-btn">
            🏋️ Quick Demo Workout
          </button>
          <button onClick={resetProgress} className="reset-btn">
            🔄 Reset Progress
          </button>
        </div>
        
        <div className="game-info">
          <h3>🎮 How to Level Up:</h3>
          <ul>
            <li>🏋️ Visit the gym: +20 XP per visit</li>
            <li>💪 Lift weights: +5 XP per 10 lbs</li>
            <li>🔄 Complete reps: +3 XP per 5 reps</li>
            <li>⏱️ Workout duration: +2 XP per minute</li>
            <li>🎯 Complete full workout: +50 XP bonus</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;