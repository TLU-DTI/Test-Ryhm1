import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Credits.css';

const Credits = () => {
  const navigate = useNavigate();

  return (
    <div className="credits-container">
        <div className="credits">
          <h2>Credits</h2>
          <p>
            This project was created as part of the summer internship course in the Informatics program at Tallinn University, specifically within the School of Digital Technologies.
          </p>
          <h3>Technologies Used</h3>
          <ul>
            <li>Discord: Communication</li>
            <li>ReactJS: JavaScript framework</li>
            <li>Canva: Design tool for risk cards and mitigation cards</li>
            <li>Unity: Game development</li>
            <li>Figma: Prototyping tool for design</li>
          </ul>
          <h3>Contributors</h3>
          <ul>
            <li>Eerik Poopuu</li>
            <li>Hannes Väster</li>
            <li>Kristjan Petersell</li>
            <li>Erik Brück</li>
            <li>Kristjan Peedisson</li>
          </ul>
      </div>
      <button className="back-menu-button-credits" onClick={() => navigate('/')}>Back to Menu</button>
    </div>
  );
};

export default Credits;