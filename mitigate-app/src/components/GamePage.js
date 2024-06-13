import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrag, useDrop } from 'react-dnd';
import Stats from './Stats';
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
    canDrop: () => !card.droppedMitigationCard, // Only allow drop if there's no mitigation card
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
    <div ref={drop} className="risk-card-container" onClick={() => openModal(card.src)}>
      <img
        src={card.src}
        alt="Risk Card"
        className="risk-card"
      />
      {card.droppedMitigationCard && (
        <img
          ref={drag}
          src={card.droppedMitigationCard.src}
          alt="Mitigation Card"
          className={`mitigation-card on-risk-card ${isDragging ? 'dragging' : ''}`}
        />
      )}
    </div>
  );
};

const MitigationDeck = ({ onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => {
      if (item.fromRiskCard) {
        onDrop(item.id);
      }
    },
  }), []);

  return (
    <div ref={drop} className="mitigation-deck">
      <div className="mitigation-deck-text">Drop Mitigation Cards Here</div>
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
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cards prop:", cards);
    if (cards && cards.length > 0) {
      drawNewCards();
    }
  }, [cards]);

  useEffect(() => {
    if (round > 12) {
      navigate('/');
    } else {
      drawNewCards();
    }
  }, [round]);

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

    // Loop through each risk card and update the tempStats accordingly
    riskCards.forEach(riskCard => {
      if (riskCard.droppedMitigationCard) {
        // If there is a mitigation card, combine the stats
        newTempStats.scope += riskCard.attributes.scope + riskCard.droppedMitigationCard.attributes.scope;
        newTempStats.quality += riskCard.attributes.quality + riskCard.droppedMitigationCard.attributes.quality;
        newTempStats.time += riskCard.attributes.time + riskCard.droppedMitigationCard.attributes.time;
        newTempStats.money += riskCard.attributes.money + riskCard.droppedMitigationCard.attributes.money;
      } else {
        // If there is no mitigation card, just add the risk card's stats
        newTempStats.scope += riskCard.attributes.scope;
        newTempStats.quality += riskCard.attributes.quality;
        newTempStats.time += riskCard.attributes.time;
        newTempStats.money += riskCard.attributes.money;
      }
    });

    // Update the overall stats with the temporary stats
    setStats(prevStats => ({
      scope: prevStats.scope + newTempStats.scope,
      quality: prevStats.quality + newTempStats.quality,
      time: prevStats.time + newTempStats.time,
      money: prevStats.money + newTempStats.money
    }));

    // Reset temporary stats for the next round
    setTempStats({ scope: 0, quality: 0, time: 0, money: 0 });

    // Move to the next round
    setRound(prevRound => prevRound + 1);
  };

  const handleDrop = (mitigationCardId, riskCardId) => {
    console.log(`Dropped mitigation card ${mitigationCardId} on risk card ${riskCardId}`);
    const droppedCard = mitigationCards.find(card => card.id === mitigationCardId);
    const riskCard = riskCards.find(card => card.id === riskCardId);

    if (droppedCard && riskCard) {
      // Update risk card with dropped mitigation card
      setRiskCards(prev => prev.map(card => 
        card.id === riskCardId ? { ...card, droppedMitigationCard: droppedCard } : card
      ));
      setMitigationCards(prev => prev.filter(card => card.id !== mitigationCardId));
      setPlayedMitigationCards(prev => [...prev, mitigationCardId]);

      // Update temporary stats
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

  const handleRemove = (mitigationCardId) => {
    console.log(`Removed mitigation card ${mitigationCardId} from risk card`);
    const removedCard = cards.find(card => card.id === mitigationCardId);
    const riskCard = riskCards.find(card => card.droppedMitigationCard?.id === mitigationCardId);

    if (removedCard && riskCard) {
      setRiskCards(prev => prev.map(card => 
        card.droppedMitigationCard?.id === mitigationCardId ? { ...card, droppedMitigationCard: null } : card
      ));
      setMitigationCards(prev => [...prev, removedCard]);
      setPlayedMitigationCards(prev => prev.filter(id => id !== mitigationCardId));

      // Update temporary stats
      setTempStats(prevTempStats => ({
        scope: prevTempStats.scope - removedCard.attributes.scope - riskCard.attributes.scope,
        quality: prevTempStats.quality - removedCard.attributes.quality - riskCard.attributes.quality,
        time: prevTempStats.time - removedCard.attributes.time - riskCard.attributes.time,
        money: prevTempStats.money - removedCard.attributes.money - riskCard.attributes.money
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

  return (
    <div className="game-page">
      <div className="game-header">
        <button className="back-menu-button" onClick={() => navigate('/')}>Back to Menu</button>
        <div className="round-counter">Round: {round}</div>
        <button className="end-round-button" onClick={endRound}>End Round</button>
      </div>
      <Stats stats={stats} />  {/* Add the Stats component here */}
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
        <MitigationDeck onDrop={handleRemove} />
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