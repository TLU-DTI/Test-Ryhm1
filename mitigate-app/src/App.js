import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

import GamePage from './components/GamePage';
import Settings from './components/Settings';
import Leaderboards from './components/Leaderboards';
import cardImages1 from './data/cardImages1';
import cardImages2 from './data/cardImages2';

const Header = ({ pathname }) => {
  const getHeaderText = () => {
    switch (pathname) {
      case '/settings':
        return 'Settings';
      case '/leaderboards':
        return 'Leaderboards';
      default:
        return 'Mitigate';
    }
  };

  return (
    <div className="app-header-container">
      <div className="app-header">
        <h1>{getHeaderText()}</h1>
      </div>
    </div>
  );
};

const Menu = ({ shuffleCards, navigate }) => (
  <div className="menu-box">
    <button onClick={shuffleCards}>New game</button>
    <button onClick={() => navigate('/settings')}>Settings</button>
    <button onClick={() => navigate('/leaderboards')}>Leaderboards</button>
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
        </Routes>
      </div>
    </DndProvider>
  );
}

export default App;