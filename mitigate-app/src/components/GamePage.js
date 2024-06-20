import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import Stats from './Stats';
import RiskLog from './RiskLog';
import './Stats.css';
import GameEndScreen from './GameEndScreen';
import './GamePage.css';
import audioManager from './audioManager';

const ItemTypes = {
  CARD: 'card',
};

const playSound = (src) => {
  const audio = new Audio(src);
  audio.volume = audioManager.volume; // Set volume based on AudioManager
  audio.play();
};

const MitigationCard = ({ card, openModal, handleDrop }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { id: card.id, fromRiskCard: false },
  }), [card]);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => {
      if (item.fromRiskCard) {
        handleDrop(item.id, null); // Remove from risk card and add back to mitigation deck
      }
    },
  }), [handleDrop]);

  return (
    <img
      ref={(node) => drag(drop(node))}
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
  const navigate = useNavigate();
  const difficulty = localStorage.getItem('difficulty') || 'normal';
  const initialStats = {
    easy: { scope: 60, quality: 60, time: 60, money: 60 },
    normal: { scope: 50, quality: 50, time: 50, money: 50 },
    hard: { scope: 40, quality: 40, time: 40, money: 40 },
  };

  const [round, setRound] = useState(1);
  const [riskCards, setRiskCards] = useState([]);
  const [mitigationCards, setMitigationCards] = useState([]);
  const [playedMitigationCards, setPlayedMitigationCards] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [stats, setStats] = useState(initialStats[difficulty]);
  const [tempStats, setTempStats] = useState({ scope: 0, quality: 0, time: 0, money: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [riskLogs, setRiskLogs] = useState([['Initial log']]);
  const [previousRoundLogs, setPreviousRoundLogs] = useState([]);

  // Create a ref for the background audio
  const audioRef = useRef(new Audio("sounds/Breath-within.mp3"));

  useEffect(() => {
    if (cards && cards.length > 0) {
      drawNewCards();
    }
  }, [cards]);

  useEffect(() => {
    if (round > 12 || Object.values(stats).some(stat => stat < 25)) {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedSliderValue = localStorage.getItem('sliderValue');
      let volume = 0.5; // Default volume
  
      if (savedSliderValue !== null) {
        const parsedVolume = parseFloat(savedSliderValue);
        if (!isNaN(parsedVolume) && isFinite(parsedVolume)) {
          volume = parsedVolume / 100;
        }
      }
  
      audioRef.current.volume = volume; // Set the volume based on the saved slider value
      audioRef.current.loop = true;
      audioRef.current.play();
    }, 1000);
  
    // Clear the timeout and stop the audio when the component unmounts
    return () => {
      clearTimeout(timer);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    if (round > 1) {
      setPreviousRoundLogs(riskLogs[riskLogs.length - 1]);
    }
  }, [riskLogs]);

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
    setRiskCards(newRiskCards);
    setMitigationCards(newMitigationCards);
  };

  const endRound = () => {
    const newTempStats = { scope: 0, quality: 0, time: 0, money: 0 };
    const roundRiskLogs = [];

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

    riskCards.forEach((riskCard, index) => {
      const riskCardWentThrough = probabilityCheck(riskCard.attributes.probability);
      const cardNumber = index + 1;
      let logMessage = '';

      if (riskCard.droppedMitigationCard) {
        if (riskCardWentThrough) {
          logMessage = `Risk card ${cardNumber}: went through AND a mitigation card was placed on top`;
        } else {
          logMessage = `Risk card ${cardNumber}: hasn't gone through but a mitigation card was placed on top anyway`;
        }
        newTempStats.scope += riskCard.droppedMitigationCard.attributes.scope;
        newTempStats.quality += riskCard.droppedMitigationCard.attributes.quality;
        newTempStats.time += riskCard.droppedMitigationCard.attributes.time;
        newTempStats.money += riskCard.droppedMitigationCard.attributes.money;

        if (riskCardWentThrough) {
          newTempStats.scope += riskCard.attributes.scope;
          newTempStats.quality += riskCard.attributes.quality;
          newTempStats.time += riskCard.attributes.time;
          newTempStats.money += riskCard.attributes.money;
        }
      } else {
        if (riskCardWentThrough) {
          logMessage = `Risk card ${cardNumber}: went through without a mitigation card placed on top`;
          newTempStats.scope += riskCard.attributes.scope;
          newTempStats.quality += riskCard.attributes.quality;
          newTempStats.time += riskCard.attributes.time;
          newTempStats.money += riskCard.attributes.money;
        } else {
          logMessage = `Risk card ${cardNumber}: hasn't gone through AND a mitigation card HASN'T been placed on top`;
        }
      }

      roundRiskLogs.push(logMessage);
    });

    setRiskLogs(prevLogs => [...prevLogs, roundRiskLogs]);
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
    if (riskCardId === null) {
      // Moving the card back to the mitigation deck
      setRiskCards(prevRiskCards =>
        prevRiskCards.map(card => {
          if (card.droppedMitigationCard?.id === mitigationCardId) {
            const updatedCard = { ...card, droppedMitigationCard: null };
            setPlayedMitigationCards(prev => prev.filter(id => id !== mitigationCardId));
            setMitigationCards(prevMitigationCards => [
              ...prevMitigationCards,
              mitigationCards.find(mitCard => mitCard.id === mitigationCardId) || card.droppedMitigationCard,
            ]);
            playSound('/sounds/card-return.mp3'); // Play return sound
            return updatedCard;
          }
          return card;
        })
      );
    } else {
      // Placing the card on a risk card
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
        playSound('/sounds/card-place.mp3'); // Play place sound
      } else {
        console.error(`Mitigation card with id ${mitigationCardId} or risk card with id ${riskCardId} not found`);
      }
    }
  };

  const openModal = (src) => {
    setModalImage(src);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleEndRoundClick = () => {
    audioManager.playUIClickSound();
    endRound();
  };

  if (gameOver) {
    return (
      <GameEndScreen finalStats={stats} mitigationsCount={playedMitigationCards.length} roundsPlayed={round} difficulty={difficulty} />
    );
  }

  return (
    <div className="game-page">
      <div className="game-header">
        <button className="back-menu-button" onClick={() => { audioManager.playUIClickSound(); navigate('/'); }}>Back to Menu</button>
        <div className="round-counter">Round: {round}</div>
        <button className="end-round-button" onClick={handleEndRoundClick}>End Round</button>
      </div>
      <Stats stats={stats} />
      <RiskLog logs={previousRoundLogs} />
      <div className="cards-container">
        <div className="risk-cards-container">
          {riskCards.map(card => card ? (
            <RiskCard key={card.id} card={card} onDrop={handleDrop} openModal={openModal} />
          ) : null)}
        </div>
        <div className="mitigation-cards">
          {mitigationCards.map(card => card ? (
            <MitigationCard key={card.id} card={card} openModal={openModal} handleDrop={handleDrop} />
          ) : null)}
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