import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWeekId, setSelectedWeekId] = useState(null);
  const [gameWeeks, setGameWeeks] = useState([]);

  const fetchGameWeeks = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('game_weeks')
      .select('id, week_number')
      .order('week_number', { ascending: false });
    
    if (err) {
      console.error("Error fetching game weeks:", err);
      setError("Erreur de chargement des semaines de jeu.");
    } else {
      setGameWeeks(data || []);
      if (data && data.length > 0 && !selectedWeekId) { // Set default only if not already set
        setSelectedWeekId(data[0].id);
      }
    }
  }, [selectedWeekId]); // Add selectedWeekId to prevent re-setting if it was already chosen

  const fetchLeaderboard = useCallback(async () => {
    if (!selectedWeekId) {
      setLeaderboardData([]); // Clear data if no week is selected
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Pour que cette requête fonctionne, vous devez avoir une table 'profiles'
      // avec une colonne 'user_id' (qui est la clé étrangère vers auth.users.id)
      // et une colonne 'username'.
      // Assurez-vous que RLS permet la lecture de 'profiles.username' lorsque joint à 'user_weekly_scores'.
      // Une politique simple sur 'profiles' pourrait être: `CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);`
      // ATTENTION: Cela rend tous les usernames publics. Adaptez selon vos besoins de confidentialité.
      const { data, error: leaderboardError } = await supabase
        .from('user_weekly_scores')
        .select(`
          score,
          user_id,
          profiles ( username )
        `)
        .eq('week_id', selectedWeekId)
        .order('score', { ascending: false })
        .limit(100);

      if (leaderboardError) throw leaderboardError;

      const formattedData = data.map(entry => ({
        ...entry,
        username: entry.profiles?.username || `User...${entry.user_id.substring(entry.user_id.length - 6)}` // Fallback
      }));
      setLeaderboardData(formattedData);

    } catch (err) {
      setError('Erreur chargement classement: ' + err.message);
      console.error(err);
      setLeaderboardData([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, [selectedWeekId]);

  useEffect(() => {
    fetchGameWeeks();
  }, [fetchGameWeeks]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]); // Dépend de fetchLeaderboard qui dépend de selectedWeekId


  const handleWeekChange = (event) => {
    setSelectedWeekId(event.target.value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Classement</h2>
      
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="week-select" style={{ marginRight: '10px' }}>Afficher le classement pour :</label>
        <select 
          id="week-select" 
          onChange={handleWeekChange} 
          value={selectedWeekId || ''} 
          disabled={gameWeeks.length === 0}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {gameWeeks.length === 0 && <option value="">Chargement des semaines...</option>}
          {gameWeeks.map(week => (
            <option key={week.id} value={week.id}>Semaine {week.week_number}</option>
          ))}
        </select>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Chargement du classement...</p>}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      
      {!loading && !error && leaderboardData.length === 0 && selectedWeekId &&
        <p style={{ textAlign: 'center' }}>Aucun score disponible pour la semaine sélectionnée.</p>
      }
      {!loading && !error && !selectedWeekId && gameWeeks.length > 0 &&
         <p style={{ textAlign: 'center' }}>Veuillez sélectionner une semaine pour afficher le classement.</p>
      }


      {!loading && !error && leaderboardData.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>Rang</th>
              <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'left' }}>Utilisateur</th>
              <th style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'right' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((entry, index) => (
              <tr key={entry.user_id + '-' + index} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa' }}>
                <td style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</td>
                <td style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'left' }}>{entry.username}</td>
                <td style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* L'affichage des récompenses par tiers (top 10%, etc.) peut être ajouté ici */}
      {/* en calculant les seuils sur leaderboardData si besoin */}
    </div>
  );
}

export default Leaderboard;