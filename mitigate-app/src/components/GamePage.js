import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import Stats from './Stats';
import GameEndScreen from './GameEndScreen'; // Import the GameEndScreen component
import './GamePage.css';

const ItemTypes = {
  CARD: 'card',
};

const MitigationCard = ({ card, openModal }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: card.id, fromRiskCard: false },
  }), [card]);

  return (
    <img
      ref={drag}
      src={card.src}
      alt="Mitigation Card"
      className="mitigation-card"
      onClick={() => openModal(card.src)}
    />
  );
};

const RiskCard = ({ card, onDrop, openModal }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => onDrop(item.id, card.id),
    canDrop: () => !card.droppedMitigationCard,
  }), [card]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: card.droppedMitigationCard?.id, fromRiskCard: true },
    canDrag: () => !!card.droppedMitigationCard,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [card.droppedMitigationCard]);

  return (
    <div ref={drop} className="risk-card-container">
      <img
        src={card.src}
        alt="Risk Card"
        className="risk-card"
        onClick={() => openModal(card.src)}
      />
      {card.droppedMitigationCard && (
        <img
          ref={drag}
          src={card.droppedMitigationCard.src}
          alt="Mitigation Card"
          className={`mitigation-card on-risk-card ${isDragging ? 'dragging' : ''}`}
          onClick={() => openModal(card.droppedMitigationCard.src)}
        />
      )}
    </div>
  );
};

const GamePage = ({ cards }) => {
  const [round, setRound] = useState(1);
  const [riskCards, setRiskCards] = useState([]);
  const [mitigationCards, setMitigationCards] = useState([]);
  const [playedMitigationCards, setPlayedMitigationCards] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [stats, setStats] = useState({ scope: 40, quality: 40, time: 40, money: 40 });  // Initial stats
  const [tempStats, setTempStats] = useState({ scope: 0, quality: 0, time: 0, money: 0 });
  const [gameOver, setGameOver] = useState(false); // New state for game over
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cards prop:", cards);
    if (cards && cards.length > 0) {
      drawNewCards();
    }
  }, [cards]);

  useEffect(() => {
    if (round > 12 || Object.values(stats).some(stat => stat <= 0)) {
      setGameOver(true);
    } else {
      drawNewCards();
    }
  }, [round, stats]);

  useEffect(() => {
    console.log("Stats updated:", stats);
  }, [stats]);

  useEffect(() => {
    console.log("Temp stats updated:", tempStats);
  }, [tempStats]);

  const getCardCounts = () => {
    if (round >= 1 && round <= 3) {
      return { risk: 1, mitigation: 2 };
    } else if (round >= 4 && round <= 7) {
      return { risk: 2, mitigation: 3 };
    } else if (round >= 8 && round <= 12) {
      return { risk: 3, mitigation: 4 };
    }
    return { risk: 0, mitigation: 0 };
  };

  const drawNewCards = () => {
    console.log("Drawing new cards...");
    const { risk: riskCount, mitigation: mitigationCount } = getCardCounts();
    const riskCards = cards.filter(card => card.src.includes('/Risk cards/'));
    const availableMitigationCards = cards.filter(card => card.src.includes('/Mitigation cards/') && !playedMitigationCards.includes(card.id));

    const newRiskCards = [];
    for (let i = 0; i < riskCount; i++) {
      const newRiskCard = riskCards[Math.floor(Math.random() * riskCards.length)];
      newRiskCards.push(newRiskCard);
      riskCards.splice(riskCards.indexOf(newRiskCard), 1);
    }

    const newMitigationCards = availableMitigationCards.slice(0, mitigationCount);
    console.log("New risk cards:", newRiskCards);
    console.log("New mitigation cards:", newMitigationCards);
    setRiskCards(newRiskCards);
    setMitigationCards(newMitigationCards);
  };

  const endRound = () => {
    const newTempStats = { scope: 0, quality: 0, time: 0, money: 0 };

    const probabilityCheck = (probability) => {
      const randomValue = Math.random() * 100;
      if (probability === 1) return randomValue < 50;
      if (probability === 2) return randomValue < 65;
      if (probability === 3) return randomValue < 80;
      if (probability === 4) return randomValue < 85;
      if (probability === 5) return randomValue < 90;
      if (probability === 6) return randomValue < 95;
      return false;
    };

    riskCards.forEach(riskCard => {
      const riskCardWentThrough = probabilityCheck(riskCard.attributes.probability);

      if (riskCard.droppedMitigationCard) {
        newTempStats.scope += riskCard.droppedMitigationCard.attributes.scope;
        newTempStats.quality += riskCard.droppedMitigationCard.attributes.quality;
        newTempStats.time += riskCard.droppedMitigationCard.attributes.time;
        newTempStats.money += riskCard.droppedMitigationCard.attributes.money;

        if (riskCardWentThrough) {
          console.log(`Risk card ${riskCard.id} went through and a mitigation card was placed.`);
          newTempStats.scope += riskCard.attributes.scope;
          newTempStats.quality += riskCard.attributes.quality;
          newTempStats.time += riskCard.attributes.time;
          newTempStats.money += riskCard.attributes.money;
        } else {
          console.log(`Risk card ${riskCard.id} did not go through but a mitigation card was placed.`);
        }
      } else {
        if (riskCardWentThrough) {
          console.log(`Risk card ${riskCard.id} went through without a mitigation card placed.`);
          newTempStats.scope += riskCard.attributes.scope;
          newTempStats.quality += riskCard.attributes.quality;
          newTempStats.time += riskCard.attributes.time;
          newTempStats.money += riskCard.attributes.money;
        } else {
          console.log(`Risk card ${riskCard.id} did not go through.`);
        }
      }
    });

    setStats(prevStats => ({
      scope: prevStats.scope + newTempStats.scope,
      quality: prevStats.quality + newTempStats.quality,
      time: prevStats.time + newTempStats.time,
      money: prevStats.money + newTempStats.money
    }));

    setTempStats({ scope: 0, quality: 0, time: 0, money: 0 });
    setRound(prevRound => prevRound + 1);
  };

  const handleDrop = (mitigationCardId, riskCardId) => {
    console.log(`Dropped mitigation card ${mitigationCardId} on risk card ${riskCardId}`);
    const droppedCard = mitigationCards.find(card => card.id === mitigationCardId);
    const riskCard = riskCards.find(card => card.id === riskCardId);

    if (droppedCard && riskCard) {
      setRiskCards(prev => prev.map(card =>
        card.id === riskCardId ? { ...card, droppedMitigationCard: droppedCard } : card
      ));
      setMitigationCards(prev => prev.filter(card => card.id !== mitigationCardId));
      setPlayedMitigationCards(prev => [...prev, mitigationCardId]);

      setTempStats(prevTempStats => ({
        scope: prevTempStats.scope + droppedCard.attributes.scope + riskCard.attributes.scope,
        quality: prevTempStats.quality + droppedCard.attributes.quality + riskCard.attributes.quality,
        time: prevTempStats.time + droppedCard.attributes.time + riskCard.attributes.time,
        money: prevTempStats.money + droppedCard.attributes.money + riskCard.attributes.money
      }));
    } else {
      console.error(`Mitigation card with id ${mitigationCardId} not found`);
    }
  };

  const openModal = (src) => {
    setModalImage(src);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  if (gameOver) {
    return (
      <GameEndScreen finalStats={stats} mitigationsCount={playedMitigationCards.length} roundsPlayed={round} />
    );
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <button className="back-menu-button" onClick={() => navigate('/')}>Back to Menu</button>
        <div className="round-counter">Round: {round}</div>
        <button className="end-round-button" onClick={endRound}>End Round</button>
      </div>
      <Stats stats={stats} />
      <div className="cards-container">
        <div className="risk-cards-container">
          {riskCards.map(card => (
            <RiskCard key={card.id} card={card} onDrop={handleDrop} openModal={openModal} />
          ))}
        </div>
        <div className="mitigation-cards">
          {mitigationCards.map(card => (
            <MitigationCard key={card.id} card={card} openModal={openModal} />
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