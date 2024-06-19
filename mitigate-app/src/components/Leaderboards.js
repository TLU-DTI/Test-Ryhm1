import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Leaderboards.css';

const playSound = () => {
  const audio = new Audio('/sounds/ui-click.mp3');
  audio.play();
};

const Leaderboards = () => {
  const [scores, setScores] = useState([]);
  const [expandedScore, setExpandedScore] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('scores')) || [];
    // Sort scores by roundsPlayed in descending order
    const sortedScores = savedScores.sort((a, b) => b.roundsPlayed - a.roundsPlayed);
    // Take only the top 7 scores
    const topScores = sortedScores.slice(0, 7);
    setScores(topScores);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const clearLeaderboards = () => {
    localStorage.setItem('scores', JSON.stringify([]));
    setScores([]);
  };

  const handleClearLeaderboardsClick = () => {
    playSound();
    clearLeaderboards();
  };

  const toggleExpandedScore = (index) => {
    if (expandedScore === index) {
      setExpandedScore(null);
    } else {
      setExpandedScore(index);
    }
  };

  return (
    <div className="leaderboards">
      <div className="scores-list">
        {scores.map((score, index) => (
          <div key={index} className="score-entry">
            <div className="score-summary" onClick={() => toggleExpandedScore(index)}>
              <span className="score-rank">#{index + 1}</span>
              <span className="score-name">{score.name}</span>
              <span className="score-date">{formatDate(score.date)}</span>
            </div>
            {expandedScore === index && (
              <div className="score-details">
                <div className="stat">Scope: {score.finalStats.scope}</div>
                <div className="stat">Quality: {score.finalStats.quality}</div>
                <div className="stat">Time: {score.finalStats.time}</div>
                <div className="stat">Money: {score.finalStats.money}</div>
                <div className="mitigations-count">
                  Risks mitigated: {score.mitigationsCount}
                </div>
                <div className="round-count">
                  Rounds played: {score.roundsPlayed}
                </div>
                <div className="difficulty">
                  Difficulty: {score.difficulty}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button className="clear-leaderboards-button" onClick={handleClearLeaderboardsClick}>Clear Leaderboards</button>
        <br></br>
        <button className="back-menu-button" onClick={() => { playSound(); navigate('/'); }}>Back to Menu</button>
      </div>
    </div>
  );
};

export default Leaderboards;