import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const clickSound = new Audio('/sounds/ui-click.mp3');

const playSound = () => {
  clickSound.play();
};

const Settings = () => {
  const [difficulty, setDifficulty] = useState('normal');
  const [name, setName] = useState('');
  const [sliderValue, setSliderValue] = useState(50); // Uus state slideri väärtuse jaoks
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedDifficulty = localStorage.getItem('difficulty') || 'normal';
    const savedName = localStorage.getItem('name') || '';
    setDifficulty(savedDifficulty);
    setName(savedName);
  }, []);

  const handleDifficultyChange = (event) => {
    const selectedDifficulty = event.target.value;
    setDifficulty(selectedDifficulty);
    localStorage.setItem('difficulty', selectedDifficulty);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    playSound();
  };

  const handleNameChange = (event) => {
    const enteredName = event.target.value;
    setName(enteredName);
    localStorage.setItem('name', enteredName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    playSound();
  };

  const handleSliderChange = (event) => {
    const sliderVal = parseInt(event.target.value);
    setSliderValue(sliderVal);
    // Lisaks salvesta slideri väärtus, kui soovite seda hiljem kasutada
    localStorage.setItem('sliderValue', sliderVal.toString());
    playSound();
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
      </label>
      
      <br />
      <label>
        Name:
        <input type="text" value={name} onChange={handleNameChange} />
      </label>
      
      <br />
      <div className="slider-container">
        <label>
          Music:
          <input 
            type="range" 
            min="0" 
            max="100" 
            className="slider"
          />
        </label>
      </div>
      
      <br />
      {isSaved && <div className="save-confirmation">Settings Saved!</div>}
      <button className="back-menu-button" onClick={() => { navigate('/'); playSound(); }}>Back to Menu</button>
    </div>
  );
  
};

export default Settings;
