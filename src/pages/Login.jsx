import React, { useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate, Link } from 'react-router-dom';

function Login({ isModal = false, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      if (isModal && onClose) {
        onClose(); // Ferme la modale si c'est le cas
        // Tu pourrais également recharger la page d'accueil ou mettre à jour un état global ici
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email-login" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input id="email-login" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}/>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password-login" style={{ display: 'block', marginBottom: '5px' }}>Mot de passe:</label>
          <input id="password-login" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}/>
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}>
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>
      {!isModal && (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Pas encore de compte ? <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>S'inscrire</Link>
        </p>
      )}
    </div>
  );
}

export default Login;