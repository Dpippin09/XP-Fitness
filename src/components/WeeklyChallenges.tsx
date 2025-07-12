import React, { useState, useEffect } from 'react';

interface Challenge {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    xpReward: number;
    icon: string;
    type: 'gymVisits' | 'weightLifted' | 'workoutDuration' | 'repetitions';
    completed: boolean;
}

interface WeeklyChallengesProps {
    workoutData: {
        weightLifted: number;
        repetitions: number;
        workoutDuration: number;
        gymVisits: number;
    };
    onChallengeCompleted: (xp: number, challengeTitle: string) => void;
}

const WeeklyChallenges: React.FC<WeeklyChallengesProps> = ({ workoutData, onChallengeCompleted }) => {
    const [challenges, setChallenges] = useState<Challenge[]>([
        {
            id: 'gym-warrior',
            title: 'Gym Warrior',
            description: 'Visit the gym 5 times this week',
            target: 5,
            current: 0,
            xpReward: 200,
            icon: '🏋️',
            type: 'gymVisits',
            completed: false
        },
        {
            id: 'iron-lifter',
            title: 'Iron Lifter',
            description: 'Lift a total of 1000 lbs this week',
            target: 1000,
            current: 0,
            xpReward: 300,
            icon: '💪',
            type: 'weightLifted',
            completed: false
        },
        {
            id: 'endurance-master',
            title: 'Endurance Master',
            description: 'Complete 300 minutes of workout this week',
            target: 300,
            current: 0,
            xpReward: 250,
            icon: '⏱️',
            type: 'workoutDuration',
            completed: false
        },
        {
            id: 'rep-champion',
            title: 'Rep Champion',
            description: 'Complete 500 repetitions this week',
            target: 500,
            current: 0,
            xpReward: 150,
            icon: '🔄',
            type: 'repetitions',
            completed: false
        }
    ]);

    // Update challenge progress based on workout data
    useEffect(() => {
        setChallenges(prevChallenges => 
            prevChallenges.map(challenge => {
                const newCurrent = workoutData[challenge.type];
                const wasCompleted = challenge.completed;
                const isNowCompleted = newCurrent >= challenge.target;
                
                // If challenge just got completed, trigger the callback
                if (!wasCompleted && isNowCompleted) {
                    onChallengeCompleted(challenge.xpReward, challenge.title);
                }
                
                return {
                    ...challenge,
                    current: Math.min(newCurrent, challenge.target),
                    completed: isNowCompleted
                };
            })
        );
    }, [workoutData, onChallengeCompleted]);

    const getProgressPercentage = (current: number, target: number): number => {
        return Math.min((current / target) * 100, 100);
    };

    const getTimeUntilReset = (): string => {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
        
        if (daysUntilMonday === 1) {
            return "Resets tomorrow";
        }
        return `Resets in ${daysUntilMonday} days`;
    };

    return (
        <div className="weekly-challenges">
            <div className="challenges-header">
                <h2>🏆 Weekly Challenges</h2>
                <span className="reset-timer">{getTimeUntilReset()}</span>
            </div>
            
            <div className="challenges-grid">
                {challenges.map(challenge => (
                    <div 
                        key={challenge.id} 
                        className={`challenge-card ${challenge.completed ? 'completed' : ''}`}
                    >
                        <div className="challenge-header">
                            <span className="challenge-icon">{challenge.icon}</span>
                            <div className="challenge-info">
                                <h3>{challenge.title}</h3>
                                <p>{challenge.description}</p>
                            </div>
                            {challenge.completed && (
                                <span className="completion-badge">✅</span>
                            )}
                        </div>
                        
                        <div className="challenge-progress">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ width: `${getProgressPercentage(challenge.current, challenge.target)}%` }}
                                ></div>
                            </div>
                            <div className="progress-text">
                                <span>{challenge.current}/{challenge.target}</span>
                                <span className="xp-reward">+{challenge.xpReward} XP</span>
                            </div>
                        </div>
                        
                        {challenge.completed && (
                            <div className="completion-message">
                                🎉 Challenge Complete! +{challenge.xpReward} XP earned!
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <div className="challenges-footer">
                <p>💡 Complete challenges to earn bonus XP and level up faster!</p>
                <p>🔄 Challenges reset every Monday at midnight</p>
            </div>
        </div>
    );
};

export default WeeklyChallenges;
