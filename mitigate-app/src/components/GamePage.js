import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GamePage.css';

const GamePage = ({ cards }) => {
  const [round, setRound] = useState(1);
  const [riskCard, setRiskCard] = useState(null);
  const [mitigationCards, setMitigationCards] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    drawNewCards();
  }, [cards]);

  const drawNewCards = () => {
    const newRiskCard = cards.filter(card => card.src.includes('/Risk cards/'))[Math.floor(Math.random() * cards.filter(card => card.src.includes('/Risk cards/')).length)];
    const newMitigationCards = cards.filter(card => card.src.includes('/Mitigation cards/')).slice(0, 2);
    setRiskCard(newRiskCard);
    setMitigationCards(newMitigationCards);
  };

  const endRound = () => {
    setRound(prevRound => prevRound + 1);
    drawNewCards();
  };

  const openModal = (src) => {
    setModalImage(src);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (!riskCard || mitigationCards.length < 2) {
    return <div>Loading...</div>;
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <button className="back-menu-button" onClick={() => navigate('/')}>Back to Menu</button>
        <div className="round-counter">Round: {round}</div>
        <button className="end-round-button" onClick={endRound}>End Round</button>
      </div>
      <div className="cards-container">
        <div className="risk-card">
          <img src={riskCard.src} alt="Risk Card" onClick={() => openModal(riskCard.src)} />
        </div>
        <div className="mitigation-cards">
          {mitigationCards.map(card => (
            <img key={card.id} src={card.src} alt="Mitigation Card" onClick={() => openModal(card.src)} />
          ))}
        </div>
      </div>
      {modalImage && (
        <div className="modal" onClick={closeModal}>
          <img src={modalImage} alt="Enlarged Card" />
        </div>
      )}
    </div>
  );
};

export default GamePage;