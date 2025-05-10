import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenue sur Fantasy Valorant GC</h1>
      <p className="home-description">
        Plongez dans l'univers compétitif de Valorant et construisez votre équipe de rêve.
        Affrontez d'autres passionnés, grimpez au classement et collectionnez des récompenses uniques.
      </p>
      <Link to="/team" className="home-cta">
        Commencer l'aventure
      </Link>
    </div>
  );
}

export default HomePage;