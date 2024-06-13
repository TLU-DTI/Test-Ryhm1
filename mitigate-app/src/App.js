import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';
import GamePage from './components/GamePage';

const cardImages1 = [
  { src: "/img/Mitigation cards/1.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/2.png", attributes: { scope: 0, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/3.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/4.png", attributes: { scope: 5, quality: 5, time: 0, money: 0 } },
  { src: "/img/Mitigation cards/5.png", attributes: { scope: 0, quality: 0, time: 0, money: 10 } },
  { src: "/img/Mitigation cards/6.png", attributes: { scope: 0, quality: 0, time: 10, money: 0 } },
  { src: "/img/Mitigation cards/7.png", attributes: { scope: 0, quality: 0, time: 0, money: 5 } },
  { src: "/img/Mitigation cards/8.png", attributes: { scope: 5, quality: 5, time: 0, money: -5 } },
  { src: "/img/Mitigation cards/9.png", attributes: { scope: 5, quality: 5, time: 5, money: -10 } },
  { src: "/img/Mitigation cards/10.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/11.png", attributes: { scope: 0, quality: -5, time: 5, money: 0 } },
  { src: "/img/Mitigation cards/12.png", attributes: { scope: 5, quality: 5, time: 5, money: -10 } },
  { src: "/img/Mitigation cards/13.png", attributes: { scope: 5, quality: 5, time: 5, money: -5 } },
  { src: "/img/Mitigation cards/14.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/15.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/16.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/17.png", attributes: { scope: 5, quality: 0, time: 5, money: -5 } },
  { src: "/img/Mitigation cards/18.png", attributes: { scope: 5, quality: 5, time: 0, money: -5 } },
  { src: "/img/Mitigation cards/19.png", attributes: { scope: 5, quality: 5, time: -5, money: -5 } },
  { src: "/img/Mitigation cards/20.png", attributes: { scope: 5, quality: 5, time: 5, money: -10 } },
  { src: "/img/Mitigation cards/21.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/22.png", attributes: { scope: 5, quality: 0, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/23.png", attributes: { scope: 0, quality: 0, time: -5, money: 10 } },
  { src: "/img/Mitigation cards/24.png", attributes: { scope: 0, quality: 0, time: -5, money: 5 } },
  { src: "/img/Mitigation cards/25.png", attributes: { scope: 5, quality: 5, time: 5, money: -5 } },
  { src: "/img/Mitigation cards/26.png", attributes: { scope: 5, quality: 5, time: 5, money: -10 } },
  { src: "/img/Mitigation cards/27.png", attributes: { scope: 0, quality: 0, time: -10, money: 10 } },
  { src: "/img/Mitigation cards/28.png", attributes: { scope: 0, quality: 0, time: -5, money: 5 } },
  { src: "/img/Mitigation cards/29.png", attributes: { scope: 5, quality: 0, time: -5, money: 5 } },
  { src: "/img/Mitigation cards/30.png", attributes: { scope: 5, quality: 0, time: -5, money: 5 } },
  { src: "/img/Mitigation cards/31.png", attributes: { scope: 0, quality: 5, time: -5, money: 5 } },
  { src: "/img/Mitigation cards/32.png", attributes: { scope: -5, quality: -5, time: 5, money: 5 } },
  { src: "/img/Mitigation cards/33.png", attributes: { scope: 0, quality: 10, time: -5, money: -5 } },
  { src: "/img/Mitigation cards/34.png", attributes: { scope: 0, quality: -5, time: -10, money: 5 } },
  { src: "/img/Mitigation cards/35.png", attributes: { scope: 0, quality: 10, time: 0, money: 0 } },
  { src: "/img/Mitigation cards/36.png", attributes: { scope: 0, quality: 0, time: -5, money: 10 } },
  { src: "/img/Mitigation cards/37.png", attributes: { scope: 5, quality: 5, time: -5, money: -5 } },
  { src: "/img/Mitigation cards/38.png", attributes: { scope: 5, quality: 0, time: 0, money: 0 } },
  { src: "/img/Mitigation cards/39.png", attributes: { scope: 5, quality: 5, time: -5, money: -5 } },
  { src: "/img/Mitigation cards/40.png", attributes: { scope: 5, quality: 5, time: 5, money: 0 } },
  { src: "/img/Mitigation cards/41.png", attributes: { scope: 5, quality: -5, time: 0, money: 0 } },
  { src: "/img/Mitigation cards/42.png", attributes: { scope: 5, quality: 5, time: 5, money: 0 } },
  { src: "/img/Mitigation cards/43.png", attributes: { scope: 5, quality: 5, time: -5, money: -5 } },
  { src: "/img/Mitigation cards/44.png", attributes: { scope: 10, quality: 5, time: -5, money: -5 } },
  { src: "/img/Mitigation cards/45.png", attributes: { scope: 5, quality: 5, time: 5, money: -5 } },
  { src: "/img/Mitigation cards/46.png", attributes: { scope: 5, quality: 5, time: 5, money: 5 } },
  { src: "/img/Mitigation cards/47.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/48.png", attributes: { scope: 5, quality: 5, time: 5, money: 5 } },
  { src: "/img/Mitigation cards/49.png", attributes: { scope: 5, quality: 10, time: -5, money: 5 } },
  { src: "/img/Mitigation cards/50.png", attributes: { scope: 5, quality: 10, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/51.png", attributes: { scope: 5, quality: 5, time: 5, money: 0 } },
  { src: "/img/Mitigation cards/52.png", attributes: { scope: 5, quality: 5, time: 5, money: 0 } },
  { src: "/img/Mitigation cards/53.png", attributes: { scope: -5, quality: 5, time: 10, money: -5 } },
  { src: "/img/Mitigation cards/54.png", attributes: { scope: 5, quality: 5, time: -5, money: -5 } },
  { src: "/img/Mitigation cards/55.png", attributes: { scope: 5, quality: 5, time: -5, money: 0 } },
  { src: "/img/Mitigation cards/56.png", attributes: { scope: -5, quality: -5, time: 5, money: 0 } },
  { src: "/img/Mitigation cards/57.png", attributes: { scope: 5, quality: 5, time: -5, money: 5 } },
  { src: "/img/Mitigation cards/58.png", attributes: { scope: 0, quality: 5, time: 0, money: -5 } },
  { src: "/img/Mitigation cards/59.png", attributes: { scope: 5, quality: 5, time: 0, money: 0 } },
  { src: "/img/Mitigation cards/60.png", attributes: { scope: 5, quality: 5, time: 5, money: -5 } }
]

const cardImages2 = [
  { src: "/img/Risk cards/1.png", attributes: { scope: 5, quality: 0, time: 5, money: -10 } },
{ src: "/img/Risk cards/2.png", attributes: { scope: -5, quality: 5, time: 0, money: -5 } },
{ src: "/img/Risk cards/3.png", attributes: { scope: -5, quality: 0, time: -5, money: 0 } },
{ src: "/img/Risk cards/4.png", attributes: { scope: 0, quality: 0, time: 0, money: -5 } },
{ src: "/img/Risk cards/5.png", attributes: { scope: 5, quality: 5, time: -5, money: -5 } },
{ src: "/img/Risk cards/6.png", attributes: { scope: 0, quality: -10, time: -5, money: -5 } },
{ src: "/img/Risk cards/7.png", attributes: { scope: -10, quality: -10, time: 5, money: -5 } },
{ src: "/img/Risk cards/8.png", attributes: { scope: -5, quality: 5, time: -5, money: -5 } },
{ src: "/img/Risk cards/9.png", attributes: { scope: 0, quality: 0, time: -5, money: 0 } },
{ src: "/img/Risk cards/10.png", attributes: { scope: -5, quality: 5, time: 5, money: -5 } },
{ src: "/img/Risk cards/11.png", attributes: { scope: 0, quality: 5, time: -5, money: -5 } },
{ src: "/img/Risk cards/12.png", attributes: { scope: -5, quality: -5, time: 5, money: 5 } },
{ src: "/img/Risk cards/13.png", attributes: { scope: -5, quality: -5, time: -5, money: 10 } },
{ src: "/img/Risk cards/14.png", attributes: { scope: 0, quality: -5, time: -5, money: -5 } },
{ src: "/img/Risk cards/15.png", attributes: { scope: -5, quality: -5, time: 0, money: -5 } },
{ src: "/img/Risk cards/16.png", attributes: { scope: 0, quality: 5, time: 0, money: -5 } },
{ src: "/img/Risk cards/17.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/18.png", attributes: { scope: -5, quality: -5, time: -10, money: 5 } },
{ src: "/img/Risk cards/19.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/20.png", attributes: { scope: -10, quality: -5, time: 0, money: -5 } },
{ src: "/img/Risk cards/21.png", attributes: { scope: 5, quality: -5, time: -10, money: 0 } },
{ src: "/img/Risk cards/22.png", attributes: { scope: -5, quality: -5, time: 5, money: 0 } },
{ src: "/img/Risk cards/23.png", attributes: { scope: -5, quality: -5, time: 5, money: 0 } },
{ src: "/img/Risk cards/24.png", attributes: { scope: 0, quality: -10, time: 5, money: -5 } },
{ src: "/img/Risk cards/25.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/26.png", attributes: { scope: -10, quality: -5, time: 0, money: 0 } },
{ src: "/img/Risk cards/27.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/28.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/29.png", attributes: { scope: -10, quality: -5, time: 5, money: -10 } },
{ src: "/img/Risk cards/30.png", attributes: { scope: -5, quality: -10, time: 0, money: 0 } },
{ src: "/img/Risk cards/31.png", attributes: { scope: 0, quality: 5, time: -5, money: -5 } },
{ src: "/img/Risk cards/32.png", attributes: { scope: -5, quality: -5, time: -5, money: 0 } },
{ src: "/img/Risk cards/33.png", attributes: { scope: -5, quality: -5, time: 10, money: -5 } },
{ src: "/img/Risk cards/34.png", attributes: { scope: -5, quality: -5, time: 5, money: -10 } },
{ src: "/img/Risk cards/35.png", attributes: { scope: 0, quality: 0, time: 10, money: -10 } },
{ src: "/img/Risk cards/36.png", attributes: { scope: 0, quality: 0, time: 0, money: -10 } },
{ src: "/img/Risk cards/37.png", attributes: { scope: -5, quality: 0, time: 5, money: -5 } },
{ src: "/img/Risk cards/38.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/39.png", attributes: { scope: -5, quality: -5, time: 5, money: -10 } },
{ src: "/img/Risk cards/40.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/41.png", attributes: { scope: -5, quality: 0, time: -5, money: 0 } },
{ src: "/img/Risk cards/42.png", attributes: { scope: -5, quality: 5, time: 0, money: -5 } },
{ src: "/img/Risk cards/43.png", attributes: { scope: 0, quality: 0, time: -5, money: -5 } },
{ src: "/img/Risk cards/44.png", attributes: { scope: 0, quality: 0, time: 0, money: -15 } },
{ src: "/img/Risk cards/45.png", attributes: { scope: 0, quality: 0, time: -5, money: -10 } },
{ src: "/img/Risk cards/46.png", attributes: { scope: 0, quality: 0, time: 0, money: -10 } },
{ src: "/img/Risk cards/47.png", attributes: { scope: 0, quality: 0, time: 0, money: -10 } },
{ src: "/img/Risk cards/48.png", attributes: { scope: -5, quality: -5, time: 5, money: -5 } },
{ src: "/img/Risk cards/49.png", attributes: { scope: -5, quality: -10, time: 5, money: -5 } },
{ src: "/img/Risk cards/50.png", attributes: { scope: -5, quality: -5, time: 5, money: -10 } },
{ src: "/img/Risk cards/51.png", attributes: { scope: 0, quality: 0, time: -5, money: -15 } },
{ src: "/img/Risk cards/52.png", attributes: { scope: -5, quality: -5, time: 5, money: 0 } },
{ src: "/img/Risk cards/53.png", attributes: { scope: -5, quality: 0, time: 5, money: -10 } },
{ src: "/img/Risk cards/54.png", attributes: { scope: 0, quality: -5, time: 0, money: -5 } },
{ src: "/img/Risk cards/55.png", attributes: { scope: 0, quality: -5, time: -5, money: -5 } },
{ src: "/img/Risk cards/56.png", attributes: { scope: 0, quality: -5, time: 5, money: -10 } },
{ src: "/img/Risk cards/57.png", attributes: { scope: -5, quality: 0, time: 5, money: -5 } },
{ src: "/img/Risk cards/58.png", attributes: { scope: 0, quality: 0, time: 5, money: -10 } },
{ src: "/img/Risk cards/59.png", attributes: { scope: -10, quality: -10, time: -10, money: -20 } },
{ src: "/img/Risk cards/60.png", attributes: { scope: -20, quality: -10, time: -10, money: -10 } },
{ src: "/img/Risk cards/61.png", attributes: { scope: -20, quality: -20, time: -20, money: -20 } },
]

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
        <div className="app-header"><h1>Mitigate</h1></div>
        <br />
        {location.pathname === '/' && <button onClick={shuffleCards}>New game</button>}
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/game" element={<GamePage cards={cards} />} />
        </Routes>
      </div>
    </DndProvider>
  );
}

export default App;