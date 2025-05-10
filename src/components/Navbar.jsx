import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabase/client';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

function Navbar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const openSignupModal = () => setShowSignupModal(true);
  const closeSignupModal = () => setShowSignupModal(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logoLink}>Fantasy Valorant GC</Link>
      <div style={styles.links}>
        {user && <Link to="/team" style={styles.link}>Mon Équipe</Link>}
        <Link to="/leaderboard" style={styles.link}>Classement</Link>
        {user && <Link to="/collection" style={styles.link}>Ma Collection</Link>}
        <Link to="/rules" style={styles.link}>Règles</Link>
        <Link to="/faq" style={styles.link}>FAQ</Link>
      </div>
      <div style={styles.auth}>
        {user ? (
          <>
            <span style={styles.userEmail}>{user.email}</span>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button onClick={openLoginModal} style={styles.authButton}>Connexion</button>
            <button onClick={openSignupModal} style={styles.authButton}>Inscription</button>
          </>
        )}
      </div>

      {showLoginModal && (
        <div style={styles.modal}>
          <button onClick={closeLoginModal} style={styles.closeButton}>×</button>
          <Login isModal={true} onClose={closeLoginModal} />
        </div>
      )}

      {showSignupModal && (
        <div style={styles.modal}>
          <button onClick={closeSignupModal} style={styles.closeButton}>×</button>
          <Signup isModal={true} onClose={closeSignupModal} />
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '1rem',
    background: '#181818', // Dark background
    color: '#fff',
  },
  logoLink: {
    color: '#00f0ff', // Neon cyan
    textDecoration: 'none',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff',
  },
  links: {
    display: 'flex',
  },
  link: {
    color: '#99ff99', // Neon green
    textDecoration: 'none',
    margin: '0 10px',
    textShadow: '0 0 3px #99ff99',
  },
  auth: {
    display: 'flex',
    alignItems: 'center',
  },
  authButton: {
    backgroundColor: 'transparent',
    color: '#ff66ff', // Neon magenta
    border: '1px solid #ff66ff',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
    marginLeft: '10px',
    textShadow: '0 0 3px #ff66ff',
    transition: 'all 0.3s ease',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#ffff66', // Neon yellow
    border: '1px solid #ffff66',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
    marginLeft: '10px',
    textShadow: '0 0 3px #ffff66',
    transition: 'all 0.3s ease',
  },
  userEmail: {
    marginRight: '15px',
    color: '#fff',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: '#181818',
    color: '#fff',
    border: '1px solid #00f0ff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
    zIndex: 1000,
  },
  closeButton: {
    position: 'absolute',
    top: '5px',
    right: '10px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontSize: '1.5em',
    cursor: 'pointer',
  },
};

export default Navbar;