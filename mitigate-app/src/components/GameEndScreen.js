import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameEndScreen.css';

const clickSound = new Audio('/sounds/ui-click.mp3');

const playSound = () => {
  clickSound.play();
};

const GameEndScreen = ({ finalStats, mitigationsCount, roundsPlayed, difficulty }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('name') || 'Unknown';
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    const newScore = {
      name,
      finalStats,
      mitigationsCount,
      roundsPlayed: roundsPlayed - 1, // Adjusting for display
      date: new Date().toISOString(), // Use ISO string for consistent date comparison
      difficulty,
    };

    // Check if the score already exists to prevent duplicates
    const existingScoreIndex = scores.findIndex(
      (score) => score.name === newScore.name && score.date === newScore.date
    );

    if (existingScoreIndex === -1) {
      scores.push(newScore);
      localStorage.setItem('scores', JSON.stringify(scores));
    } else {
      console.log('Score already exists, not adding again.');
    }
  }, [finalStats, mitigationsCount, roundsPlayed, difficulty]);

  return (
    <div className="game-end-screen">
      <h1>Game Over</h1>
      <div className="final-stats">
        <div className="stat">Scope: {finalStats.scope}</div>
        <div className="stat">Quality: {finalStats.quality}</div>
        <div className="stat">Time: {finalStats.time}</div>
        <div className="stat">Money: {finalStats.money}</div>
      </div>
      <div className="mitigations-count">
        Risks mitigated: {mitigationsCount}
      </div>
      <div className="round-count">
        Rounds played: {roundsPlayed - 1}
      </div>
      <div className="difficulty">
        Difficulty: {difficulty}
      </div>
      <button className="back-menu-button" onClick={() => { navigate('/'); playSound(); }}>Back to Menu</button>
    </div>
  );
};

export default GameEndScreen;