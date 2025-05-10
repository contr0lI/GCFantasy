import React from 'react';

const homePageStyles = {
  container: {
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5em',
    color: '#00ffcc', // Neon turquoise
    textShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc',
    marginBottom: '20px',
  },
  paragraph: {
    color: '#ccffcc', // Light neon green
    lineHeight: '1.8',
    textShadow: '0 0 5px #ccffcc',
  },
};

function HomePage() {
  return (
    <div style={homePageStyles.container}>
      <h1 style={homePageStyles.title}>Bienvenue sur Fantasy Valorant GC !</h1>
      <p style={homePageStyles.paragraph}>
        Plongez dans l'univers compétitif de Valorant et construisez votre équipe de rêve.
        Affrontez d'autres passionnés, grimpez au classement et collectionnez des récompenses uniques.
      </p>
      {/* Le reste du contenu de votre page d'accueil */}
    </div>
  );
}

export default HomePage;