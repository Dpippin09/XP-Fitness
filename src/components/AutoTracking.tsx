import React, { useState, useEffect } from 'react';

interface AutoTrackingProps {
    onAutoWorkout: (workout: any) => void;
}

const AutoTracking: React.FC<AutoTrackingProps> = ({ onAutoWorkout }) => {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isNearGym, setIsNearGym] = useState(false);
    const [autoFeatures, setAutoFeatures] = useState({
        locationTracking: false,
        stepCounting: false,
        workoutDetection: false
    });

    // Mock gym locations (in a real app, these would be actual gym coordinates)
    const gymLocations = [
        { name: "FitLife Gym", lat: 40.7128, lng: -74.0060, radius: 0.1 },
        { name: "PowerHouse Fitness", lat: 40.7589, lng: -73.9851, radius: 0.1 }
    ];

    // Check if user is near a gym
    const checkGymProximity = (userLat: number, userLng: number) => {
        return gymLocations.some(gym => {
            const distance = Math.sqrt(
                Math.pow(userLat - gym.lat, 2) + Math.pow(userLng - gym.lng, 2)
            );
            return distance <= gym.radius;
        });
    };

    // Get user location
    const enableLocationTracking = () => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    
                    const nearGym = checkGymProximity(latitude, longitude);
                    if (nearGym !== isNearGym) {
                        setIsNearGym(nearGym);
                        
                        if (nearGym) {
                            // Auto check-in when near gym
                            onAutoWorkout({
                                weightLifted: 0,
                                repetitions: 0,
                                workoutDuration: 0,
                                gymVisits: 1,
                                source: 'auto-checkin'
                            });
                        }
                    }
                },
                (error) => console.error('Location error:', error),
                { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
            );
            setAutoFeatures(prev => ({ ...prev, locationTracking: true }));
        }
    };

    // Mock step counter (in a real app, you'd use device APIs)
    const enableStepCounting = () => {
        // This would integrate with device step counter APIs
        setAutoFeatures(prev => ({ ...prev, stepCounting: true }));
        
        // Simulate step counting every 30 seconds
        const stepInterval = setInterval(() => {
            const randomSteps = Math.floor(Math.random() * 100) + 50;
            // Convert steps to XP (rough approximation)
            if (randomSteps > 80) {
                onAutoWorkout({
                    weightLifted: 0,
                    repetitions: Math.floor(randomSteps / 2),
                    workoutDuration: 1, // 1 minute of activity
                    gymVisits: 0,
                    source: 'step-counter'
                });
            }
        }, 30000);

        return () => clearInterval(stepInterval);
    };

    // Mock workout detection using device motion
    const enableWorkoutDetection = () => {
        if (window.DeviceMotionEvent) {
            const handleMotion = (event: DeviceMotionEvent) => {
                // Simple motion detection logic
                const acceleration = event.accelerationIncludingGravity;
                if (acceleration && acceleration.x && acceleration.y && acceleration.z) {
                    const totalAcceleration = Math.sqrt(
                        acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
                    );
                    
                    // If significant motion detected, assume workout activity
                    if (totalAcceleration > 15) {
                        // Throttle to prevent spam
                        setTimeout(() => {
                            onAutoWorkout({
                                weightLifted: 0,
                                repetitions: 1,
                                workoutDuration: 0,
                                gymVisits: 0,
                                source: 'motion-detection'
                            });
                        }, 5000);
                    }
                }
            };

            window.addEventListener('devicemotion', handleMotion);
            setAutoFeatures(prev => ({ ...prev, workoutDetection: true }));
            
            return () => window.removeEventListener('devicemotion', handleMotion);
        }
    };

    return (
        <div className="auto-tracking">
            <h3>🤖 Automatic Tracking</h3>
            
            <div className="tracking-features">
                <div className="feature-card">
                    <h4>📍 Location-Based Check-in</h4>
                    <p>Automatically check in when you arrive at the gym</p>
                    <button 
                        onClick={enableLocationTracking}
                        className={`feature-btn ${autoFeatures.locationTracking ? 'active' : ''}`}
                        disabled={autoFeatures.locationTracking}
                    >
                        {autoFeatures.locationTracking ? '✅ Enabled' : '🔄 Enable'}
                    </button>
                    {isNearGym && <span className="status-indicator">🏋️ Near Gym Detected!</span>}
                </div>

                <div className="feature-card">
                    <h4>👟 Step Counter Integration</h4>
                    <p>Convert daily steps into workout XP</p>
                    <button 
                        onClick={enableStepCounting}
                        className={`feature-btn ${autoFeatures.stepCounting ? 'active' : ''}`}
                        disabled={autoFeatures.stepCounting}
                    >
                        {autoFeatures.stepCounting ? '✅ Enabled' : '🔄 Enable'}
                    </button>
                </div>

                <div className="feature-card">
                    <h4>🏃 Motion Detection</h4>
                    <p>Detect workout activity through device motion</p>
                    <button 
                        onClick={enableWorkoutDetection}
                        className={`feature-btn ${autoFeatures.workoutDetection ? 'active' : ''}`}
                        disabled={autoFeatures.workoutDetection}
                    >
                        {autoFeatures.workoutDetection ? '✅ Enabled' : '🔄 Enable'}
                    </button>
                </div>
            </div>

            <div className="automation-info">
                <h4>💡 Available Automations:</h4>
                <ul>
                    <li>🎯 <strong>Smart Check-ins:</strong> GPS detects gym arrival</li>
                    <li>📱 <strong>Step Integration:</strong> Daily steps → Cardio XP</li>
                    <li>🏋️ <strong>Motion Sensing:</strong> Device motion → Rep counting</li>
                    <li>⏰ <strong>Scheduled Reminders:</strong> Push notifications for workouts</li>
                    <li>📊 <strong>Health App Sync:</strong> Import data from fitness apps</li>
                </ul>
            </div>

            <div className="future-features">
                <h4>🚀 Coming Soon:</h4>
                <ul>
                    <li>📷 <strong>Camera Rep Counter:</strong> AI-powered exercise detection</li>
                    <li>⌚ <strong>Wearable Sync:</strong> Apple Watch, Fitbit integration</li>
                    <li>🔗 <strong>Equipment QR Codes:</strong> Scan to log exercises</li>
                    <li>👥 <strong>Social Challenges:</strong> Compete with friends automatically</li>
                </ul>
            </div>
        </div>
    );
};

export default AutoTracking;
