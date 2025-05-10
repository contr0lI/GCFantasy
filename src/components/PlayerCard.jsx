import React from 'react';

function PlayerCard({ player, onSelect, isSelected, budgetRemaining, disabled, type = "player" /* 'player' or 'coach' */ }) {
  const cardStyle = {
    border: `2px solid ${isSelected ? 'green' : '#ccc'}`,
    padding: '10px',
    margin: '10px',
    width: '180px', // Un peu plus large pour les infos
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center',
    backgroundColor: 'white',
    opacity: disabled && !isSelected ? 0.6 : 1,
    cursor: disabled && !isSelected ? 'not-allowed' : 'pointer',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  };

  const cardHoverStyle = {
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  };
  
  // Combine styles for hover (pseudo-selector in JS is tricky, usually done with state or CSS classes)
  // Pour une vraie gestion du hover, utiliser des classes CSS ou des gestionnaires onMouseEnter/onMouseLeave

  const canAfford = player.value <= budgetRemaining || isSelected; // Si sélectionné, on ignore le budget pour la désélection
  const isEffectivelyDisabled = (disabled && !isSelected) || (!canAfford && !isSelected);


  const handleClick = () => {
    if (!isEffectivelyDisabled) {
      onSelect(player);
    }
  };

  return (
    <div 
        style={cardStyle} 
        onClick={handleClick}
        onMouseEnter={(e) => { if (!isEffectivelyDisabled) e.currentTarget.style.transform = cardHoverStyle.transform; e.currentTarget.style.boxShadow = cardHoverStyle.boxShadow;}}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';}}
        title={isEffectivelyDisabled && !canAfford ? "Budget insuffisant" : (isEffectivelyDisabled && disabled ? "Sélection non autorisée (ex: équipe pleine)" : player.name)}
    >
      <img 
        src={player.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random&size=80`} 
        alt={player.name} 
        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px' }} 
      />
      <h4 style={{ margin: '5px 0', fontSize: '1.1em' }}>{player.name}</h4>
      {type === "player" && player.role && <p style={{ margin: '3px 0', fontSize: '0.9em', color: '#555' }}>Rôle: {player.role}</p>}
      <p style={{ margin: '3px 0', fontSize: '1em', fontWeight: 'bold' }}>Valeur: {player.value}</p>
      {isSelected && <p style={{ color: 'green', fontWeight: 'bold', fontSize: '0.9em', marginTop: '5px' }}>Sélectionné(e)</p>}
      {isEffectivelyDisabled && !isSelected && !canAfford && <p style={{color: 'red', fontSize: '0.8em', marginTop: '5px'}}>Trop cher</p>}
    </div>
  );
}

export default PlayerCard;