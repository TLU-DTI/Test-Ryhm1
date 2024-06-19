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
    <div className="how-to-play-container">
      <div className="how-to-play">
        <h1>How to Play</h1>
        <ol>
          <li>You are given a risk card and 2 mitigation cards. Every 4 rounds you get 1 extra mitigation card and 1 extra risk card.</li>
          <li>You start off with a set amount of Scope, Quality, Time and Money. When any of those stats fall below 25, you lose.</li>
          <li>Select a mitigation card from your deck and drag it onto a risk card. You can drag the mitigation card back into your deck to return it.</li>
          <li>Each risk card has skulls representing the probability each risk card has of going through. 1 skull is 50% chance, 2 skulls 65%, and 3 skulls 80%.</li>
          <li>You can either choose to mitigate a risk or take your chances and end the round without placing a mitigation card.</li>
          <li>When you mitigate a risk and the risk card goes through, the values of the mitigation card and the risk card are added together and added to your overall stats. When the risk card doesn't go through but you have a mitigation card placed, only the mitigation card stats will be added to your overall stats.</li>
          <li>There are 3 'Game end' cards, which have an extremely high probability of going through and have extremely negative effects on your score.</li>
          <li>Try to make it past round 12 and win, good luck!</li>
        </ol>
      </div>
      <button className="back-button" onClick={() => { navigate('/'); playSound(); }}>Back to Menu</button>
    </div>
  );
};

export default HowToPlay;