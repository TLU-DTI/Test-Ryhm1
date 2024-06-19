import React from 'react';
import './RiskLog.css';

const RiskLog = ({ logs }) => {
    console.log('Logs received:', logs);
  
    // Ensure logs is an array before mapping
    if (!logs || !Array.isArray(logs)) {
        return (
            <div className="risk-log-container">
                <p>No risk logs available.</p>
            </div>
        );
    }

    return (
        <div className="risk-log-container">
            <div className="log-message">
                <p>Previous round risk log:</p>
                <ul>
                    {logs.map((log, logIndex) => (
                        <li key={logIndex}>{log}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RiskLog;