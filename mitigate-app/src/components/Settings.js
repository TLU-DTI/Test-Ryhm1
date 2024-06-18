import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [difficulty, setDifficulty] = useState('normal');
  const navigate = useNavigate();

  useEffect(() => {
    const savedDifficulty = localStorage.getItem('difficulty') || 'normal';
    setDifficulty(savedDifficulty);
  }, []);

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setDifficulty(selectedDifficulty);
    localStorage.setItem('difficulty', selectedDifficulty);
  };

  return (
    <div className="settings">
      <label>
        Difficulty: 
        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
        <br></br>
      </label>
      <button className="back-menu-button" onClick={() => navigate('/')}>Back to Menu</button>
    </div>
  );
};

export default Settings;