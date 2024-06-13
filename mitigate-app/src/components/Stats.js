import React from 'react';
import './Stats.css';

const Stats = ({ stats }) => {
  return (
    <div className="stats">
      <div className="stat">Scope: {stats.scope}</div>
      <div className="stat">Quality: {stats.quality}</div>
      <div className="stat">Time: {stats.time}</div>
      <div className="stat">Money: {stats.money}</div>
    </div>
  );
};

export default Stats;