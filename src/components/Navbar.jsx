import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { supabase } from '../supabase/client';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';

function Navbar() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      navigate('/login');
    }
  };

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    mobileNav: {
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: '1rem',
      }
    },
    logoLink: {
      color: 'var(--primary)',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      textShadow: '0 0 20px var(--primary)',
    },
    links: {
      display: 'flex',
      gap: '1.5rem',
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'center',
      }
    },
    link: {
      color: 'var(--text)',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      '&:hover': {
        color: 'var(--primary)',
      }
    },
    auth: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    authButton: {
      background: 'transparent',
      color: 'var(--text)',
      border: '1px solid var(--primary)',
      borderRadius: '12px',
      padding: '8px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: 'var(--primary)',
      }
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'var(--surface)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      zIndex: 1000,
      width: '90%',
      maxWidth: '400px',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      zIndex: 999,
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'transparent',
      border: 'none',
      color: 'var(--text-secondary)',
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      '&:hover': {
        background: 'var(--border)',
      }
    },
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
            <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
            <button onClick={handleLogout} style={styles.authButton}>
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button onClick={() => openModal('login')} style={styles.authButton}>Connexion</button>
            <button onClick={() => openModal('signup')} style={styles.authButton}>Inscription</button>
          </>
        )}
      </div>

      {activeModal && (
        <>
          <div style={styles.overlay} onClick={closeModal} />
          <div style={styles.modal}>
            <button onClick={closeModal} style={styles.closeButton}>×</button>
            {activeModal === 'login' ? (
              <Login isModal={true} onClose={closeModal} />
            ) : (
              <Signup isModal={true} onClose={closeModal} />
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;