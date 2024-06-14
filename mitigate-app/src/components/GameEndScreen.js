import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameEndScreen.css';

const GameEndScreen = ({ finalStats, mitigationsCount, roundsPlayed }) => {
  const navigate = useNavigate();

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
        Rounds played: {roundsPlayed-1}
      </div>
      <button className="back-menu-button" onClick={() => navigate('/')}>Back to Menu</button>
    </div>
  );
};

export default GameEndScreen;