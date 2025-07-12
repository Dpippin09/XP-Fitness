import React from 'react';

interface LevelSystemProps {
    currentXP: number;
    level: number;
}

const LevelSystem: React.FC<LevelSystemProps> = ({ currentXP, level }) => {
    // Calculate XP needed for next level (increases by 100 each level)
    const xpForNextLevel = level * 100;
    const xpProgress = currentXP % 100;
    const progressPercentage = (xpProgress / 100) * 100;
    
    // Calculate total XP needed to reach current level
    const totalXPForCurrentLevel = (level - 1) * 100;
    
    // Determine user rank based on level
    const getUserRank = (level: number): string => {
        if (level >= 50) return "Fitness Legend";
        if (level >= 40) return "Fitness Master";
        if (level >= 30) return "Fitness Expert";
        if (level >= 20) return "Fitness Pro";
        if (level >= 10) return "Fitness Enthusiast";
        if (level >= 5) return "Fitness Rookie";
        return "Fitness Beginner";
    };

    return (
        <div className="level-system">
            <div className="level-header">
                <h2>Level {level}</h2>
                <span className="rank">{getUserRank(level)}</span>
            </div>
            
            <div className="xp-container">
                <div className="xp-bar">
                    <div 
                        className="xp-progress" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="xp-text">
                    <span>{xpProgress}/100 XP to next level</span>
                    <span>Total XP: {currentXP}</span>
                </div>
            </div>
            
            {level > 1 && (
                <div className="achievements">
                    <p>🏆 Achievement Unlocked: Reached Level {level}!</p>
                </div>
            )}
        </div>
    );
};

export default LevelSystem;
