import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HowToPlay.css'; // Import CSS for styling if needed

const clickSound = new Audio('/sounds/ui-click.mp3');

const playSound = () => {
  clickSound.play();
};

const HowToPlay = () => {
  const navigate = useNavigate();

  return (
    <div className="how-to-play">
      <p>Here you can describe the rules and objectives of the game...</p>
      <button className="back-button" onClick={() => { navigate('/'); playSound(); }}>Back to Menu</button>
    </div>
  );
};

export default HowToPlay;
