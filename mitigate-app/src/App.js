import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import audioManager from './components/audioManager';

import GamePage from './components/GamePage';
import Settings from './components/Settings';
import Leaderboards from './components/Leaderboards';
import HowToPlay from './components/HowToPlay.js'; 
import Credits from './components/Credits';  // Import Credits component
import cardImages1 from './data/cardImages1';
import cardImages2 from './data/cardImages2';

const clickSound = new Audio('/sounds/ui-click.mp3');

const playSound = () => {
  audioManager.playUIClickSound();
};

const Header = ({ pathname }) => {
  const getHeaderText = () => {
    switch (pathname) {
      case '/settings':
        return 'Settings';
      case '/leaderboards':
        return 'Leaderboards';
      case '/how-to-play': 
        return 'How to Play';
      default:
        return 'Mitigate';
    }
  };

  return (
    pathname !== '/credits' && (
      <div className="app-header-container">
        <div className="app-header">
          <h1>{getHeaderText()}</h1>
        </div>
      </div>
    )
  );
};

const Menu = ({ shuffleCards, navigate }) => (
  <div className="menu-box">
    <button onClick={() => { shuffleCards(); playSound(); }}>New game</button>
    <button onClick={() => { navigate('/how-to-play'); playSound(); }}>How to play</button>
    <button onClick={() => { navigate('/settings'); playSound(); }}>Settings</button>
    <button onClick={() => { navigate('/leaderboards'); playSound(); }}>Leaderboards</button>
  </div>
);

function App() {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const shuffleCards = () => {
    const shuffledCards = [...cardImages1, ...cardImages2]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    navigate('/game');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Header pathname={location.pathname} />
        {location.pathname === '/' && <Menu shuffleCards={shuffleCards} navigate={navigate} />}
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/game" element={<GamePage cards={cards} />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/credits" element={<Credits />} />  {/* Add Credits route */}
        </Routes>
      </div>
    </DndProvider>
  );
}

export default App;