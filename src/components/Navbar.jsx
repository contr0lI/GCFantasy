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
    }
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-link">Fantasy Valorant GC</Link>
      <div className="nav-links">
        {user && <Link to="/team" className="nav-link">Mon Équipe</Link>}
        <Link to="/leaderboard" className="nav-link">Classement</Link>
        {user && <Link to="/collection" className="nav-link">Ma Collection</Link>}
        <Link to="/rules" className="nav-link">Règles</Link>
        <Link to="/faq" className="nav-link">FAQ</Link>
      </div>
      <div className="nav-links">
        {user ? (
          <>
            <span style={{ color: 'var(--text-secondary)' }}>{user.email}</span>
            <button onClick={handleLogout} className="auth-button">
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button onClick={() => openModal('login')} className="auth-button">Connexion</button>
            <button onClick={() => openModal('signup')} className="auth-button">Inscription</button>
          </>
        )}
      </div>

      {activeModal && (
        <>
          <div style={styles.overlay} onClick={closeModal} />
          <div style={styles.modal}>
            <button onClick={closeModal} className="close-button">×</button>
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