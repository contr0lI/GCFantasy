import React, { useState } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate, Link } from 'react-router-dom';

function Signup({ isModal = false, onClose }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (signUpError) {
      setError(signUpError.message);
    } else if (data?.user?.identities?.length === 0) {
      setMessage("Un compte existe déjà avec cet email. Si vous n'avez pas confirmé votre email, veuillez vérifier votre boîte de réception ou essayer de vous connecter.");
    } else if (data?.user) {
      setMessage('Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.');
      if (isModal && onClose) {
        onClose();
        // Optionnellement, rediriger vers la connexion après un court délai
        setTimeout(() => navigate('/login'), 2000);
      } else {
        navigate('/login');
      }
    } else {
      setMessage("Si un compte avec cet email existe et n'est pas confirmé, un email de confirmation a été envoyé. Sinon, veuillez essayer de vous connecter.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Créer un compte</h2>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Pseudo:</label>
          <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}  required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Mot de passe:</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirmer le mot de passe:</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em' }}>
          {loading ? 'Chargement...' : 'S\'inscrire'}
        </button>
      </form>
      {!isModal && (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Déjà un compte ? <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Se connecter</Link>
        </p>
      )}
    </div>
  );
}

export default Signup;