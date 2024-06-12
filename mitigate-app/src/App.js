import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import GamePage from './components/GamePage';

const cardImages1 = [
{"src": "/img/Mitigation cards/1.png"},
{"src": "/img/Mitigation cards/2.png"},
{"src": "/img/Mitigation cards/3.png"},
{"src": "/img/Mitigation cards/4.png"},
{"src": "/img/Mitigation cards/5.png"},
{"src": "/img/Mitigation cards/6.png"},
{"src": "/img/Mitigation cards/7.png"},
{"src": "/img/Mitigation cards/8.png"},
{"src": "/img/Mitigation cards/9.png"},
{"src": "/img/Mitigation cards/10.png"},
{"src": "/img/Mitigation cards/11.png"},
{"src": "/img/Mitigation cards/12.png"},
{"src": "/img/Mitigation cards/13.png"},
{"src": "/img/Mitigation cards/14.png"},
{"src": "/img/Mitigation cards/15.png"},
{"src": "/img/Mitigation cards/16.png"},
{"src": "/img/Mitigation cards/17.png"},
{"src": "/img/Mitigation cards/18.png"},
{"src": "/img/Mitigation cards/19.png"},
{"src": "/img/Mitigation cards/20.png"},
{"src": "/img/Mitigation cards/21.png"},
{"src": "/img/Mitigation cards/22.png"},
{"src": "/img/Mitigation cards/23.png"},
{"src": "/img/Mitigation cards/24.png"},
{"src": "/img/Mitigation cards/25.png"},
{"src": "/img/Mitigation cards/26.png"},
{"src": "/img/Mitigation cards/27.png"},
{"src": "/img/Mitigation cards/28.png"},
{"src": "/img/Mitigation cards/29.png"},
{"src": "/img/Mitigation cards/30.png"},
{"src": "/img/Mitigation cards/31.png"},
{"src": "/img/Mitigation cards/32.png"},
{"src": "/img/Mitigation cards/33.png"},
{"src": "/img/Mitigation cards/34.png"},
{"src": "/img/Mitigation cards/35.png"},
{"src": "/img/Mitigation cards/36.png"},
{"src": "/img/Mitigation cards/37.png"},
{"src": "/img/Mitigation cards/38.png"},
{"src": "/img/Mitigation cards/39.png"},
{"src": "/img/Mitigation cards/40.png"},
{"src": "/img/Mitigation cards/41.png"},
{"src": "/img/Mitigation cards/42.png"},
{"src": "/img/Mitigation cards/43.png"},
{"src": "/img/Mitigation cards/44.png"},
{"src": "/img/Mitigation cards/45.png"},
{"src": "/img/Mitigation cards/46.png"},
{"src": "/img/Mitigation cards/47.png"},
{"src": "/img/Mitigation cards/48.png"},
{"src": "/img/Mitigation cards/49.png"},
{"src": "/img/Mitigation cards/50.png"},
{"src": "/img/Mitigation cards/51.png"},
{"src": "/img/Mitigation cards/52.png"},
{"src": "/img/Mitigation cards/53.png"},
{"src": "/img/Mitigation cards/54.png"},
{"src": "/img/Mitigation cards/55.png"},
{"src": "/img/Mitigation cards/56.png"},
{"src": "/img/Mitigation cards/57.png"},
{"src": "/img/Mitigation cards/58.png"},
{"src": "/img/Mitigation cards/59.png"},
{"src": "/img/Mitigation cards/60.png"},
{"src": "/img/Mitigation cards/61.png"},
]

const cardImages2 = [
  {"src": "/img/Risk cards/1.png"},
  {"src": "/img/Risk cards/2.png"},
  {"src": "/img/Risk cards/3.png"},
  {"src": "/img/Risk cards/4.png"},
  {"src": "/img/Risk cards/5.png"},
  {"src": "/img/Risk cards/6.png"},
  {"src": "/img/Risk cards/7.png"},
  {"src": "/img/Risk cards/8.png"},
  {"src": "/img/Risk cards/9.png"},
  {"src": "/img/Risk cards/10.png"},
  {"src": "/img/Risk cards/11.png"},
  {"src": "/img/Risk cards/12.png"},
  {"src": "/img/Risk cards/13.png"},
  {"src": "/img/Risk cards/14.png"},
  {"src": "/img/Risk cards/15.png"},
  {"src": "/img/Risk cards/16.png"},
  {"src": "/img/Risk cards/17.png"},
  {"src": "/img/Risk cards/18.png"},
  {"src": "/img/Risk cards/19.png"},
  {"src": "/img/Risk cards/20.png"},
  {"src": "/img/Risk cards/21.png"},
  {"src": "/img/Risk cards/22.png"},
  {"src": "/img/Risk cards/23.png"},
  {"src": "/img/Risk cards/24.png"},
  {"src": "/img/Risk cards/25.png"},
  {"src": "/img/Risk cards/26.png"},
  {"src": "/img/Risk cards/27.png"},
  {"src": "/img/Risk cards/28.png"},
  {"src": "/img/Risk cards/29.png"},
  {"src": "/img/Risk cards/30.png"},
  {"src": "/img/Risk cards/31.png"},
  {"src": "/img/Risk cards/32.png"},
  {"src": "/img/Risk cards/33.png"},
  {"src": "/img/Risk cards/34.png"},
  {"src": "/img/Risk cards/35.png"},
  {"src": "/img/Risk cards/36.png"},
  {"src": "/img/Risk cards/37.png"},
  {"src": "/img/Risk cards/38.png"},
  {"src": "/img/Risk cards/39.png"},
  {"src": "/img/Risk cards/40.png"},
  {"src": "/img/Risk cards/41.png"},
  {"src": "/img/Risk cards/42.png"},
  {"src": "/img/Risk cards/43.png"},
  {"src": "/img/Risk cards/44.png"},
  {"src": "/img/Risk cards/45.png"},
  {"src": "/img/Risk cards/46.png"},
  {"src": "/img/Risk cards/47.png"},
  {"src": "/img/Risk cards/48.png"},
  {"src": "/img/Risk cards/49.png"},
  {"src": "/img/Risk cards/50.png"},
  {"src": "/img/Risk cards/51.png"},
  {"src": "/img/Risk cards/52.png"},
  {"src": "/img/Risk cards/53.png"},
  {"src": "/img/Risk cards/54.png"},
  {"src": "/img/Risk cards/55.png"},
  {"src": "/img/Risk cards/56.png"},
  {"src": "/img/Risk cards/57.png"},
  {"src": "/img/Risk cards/58.png"},
  {"src": "/img/Risk cards/59.png"},
  {"src": "/img/Risk cards/60.png"},
  {"src": "/img/Risk cards/61.png"}
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
    <div className="App">
      <div className="app-header"><h1>Mitigate</h1></div>
      <br />
      {location.pathname === '/' && <button onClick={shuffleCards}>New game</button>}
      <Routes>
        <Route path="/" element={<div></div>} />
        <Route path="/game" element={<GamePage cards={cards} />} />
      </Routes>
    </div>
  );
}

export default App;