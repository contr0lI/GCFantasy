import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';
import { useUser } from '../context/UserContext';
import PlayerCard from '../components/PlayerCard';

const MAX_BUDGET = 100; // Budget par défaut
const MAX_PLAYERS = 5;
const MAX_COACHES = 1;

function TeamSelection() {
  const { user } = useUser();
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [availableCoaches, setAvailableCoaches] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [currentBudgetSpent, setCurrentBudgetSpent] = useState(0);
  const [activeWeek, setActiveWeek] = useState(null);
  const [lockTime, setLockTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const budgetRemaining = MAX_BUDGET - currentBudgetSpent;

  const fetchActiveWeekAndData = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const { data: weekData, error: weekError } = await supabase
        .from('game_weeks')
        .select('*')
        .eq('is_active', true)
        .single();

      if (weekError) throw weekError;
      if (!weekData) {
        setError("Aucune semaine de jeu active n'est configurée.");
        setLoading(false);
        return;
      }
      setActiveWeek(weekData);
      setLockTime(new Date(weekData.roster_lock_date));

      const [
        { data: playersData, error: playersError },
        { data: coachesData, error: coachesError }
      ] = await Promise.all([
        supabase.from('players').select('*'),
        supabase.from('coaches').select('*')
      ]);

      if (playersError) throw playersError;
      if (coachesError) throw coachesError;

      setAvailablePlayers(playersData || []);
      setAvailableCoaches(coachesData || []);

      if (user && weekData) {
        const { data: teamData, error: teamError } = await supabase
          .from('user_teams')
          .select('*, player_1_id(*), player_2_id(*), player_3_id(*), player_4_id(*), player_5_id(*), coach_id(*)')
          .eq('user_id', user.id)
          .eq('week_id', weekData.id)
          .single();

        if (teamError && teamError.code !== 'PGRST116') throw teamError;
        if (teamData) {
          const loadedPlayers = [
            teamData.player_1_id, teamData.player_2_id, teamData.player_3_id,
            teamData.player_4_id, teamData.player_5_id,
          ].filter(p => p);
          setSelectedPlayers(loadedPlayers);
          setSelectedCoach(teamData.coach_id);
        }
      }
    } catch (err) {
      setError(`Erreur de chargement: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchActiveWeekAndData();
  }, [fetchActiveWeekAndData]);

  useEffect(() => {
    const totalSpent = selectedPlayers.reduce((sum, p) => sum + p.value, 0) + (selectedCoach ? selectedCoach.value : 0);
    setCurrentBudgetSpent(totalSpent);
  }, [selectedPlayers, selectedCoach]);

  useEffect(() => {
    if (!lockTime) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = lockTime.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeRemaining("Sélections verrouillées !");
        clearInterval(interval);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${d}j ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockTime]);

  const handleSelectPlayer = (player) => {
    if (isTeamLocked()) return;
    setSelectedPlayers(prev => {
      const isAlreadySelected = prev.find(p => p.id === player.id);
      if (isAlreadySelected) {
        return prev.filter(p => p.id !== player.id);
      } else {
        if (prev.length < MAX_PLAYERS && (MAX_BUDGET - (currentBudgetSpent - (isAlreadySelected ? player.value : 0) + player.value) >=0) ) {
          return [...prev, player];
        }
        return prev;
      }
    });
  };

  const handleSelectCoach = (coach) => {
    if (isTeamLocked()) return;
    setSelectedCoach(prev => {
      if (prev && prev.id === coach.id) {
        return null;
      } else {
        if (!prev && (MAX_BUDGET - (currentBudgetSpent - (prev ? prev.value : 0) + coach.value) >=0) ) {
          return coach;
        }
        return prev;
      }
    });
  };

  const isTeamLocked = () => lockTime && new Date() > lockTime;

  const handleSaveTeam = async () => {
    if (!user || !activeWeek) {
      setError("Utilisateur ou semaine active non défini.");
      return;
    }
    if (isTeamLocked()) {
      setError("Les sélections sont verrouillées pour cette semaine.");
      return;
    }
    if (selectedPlayers.length !== MAX_PLAYERS || !selectedCoach) {
      setError(`Veuillez sélectionner ${MAX_PLAYERS} joueuses et ${MAX_COACHES} coach.`);
      return;
    }
    if (budgetRemaining < 0) {
      setError("Budget dépassé !");
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    const teamPayload = {
      user_id: user.id,
      week_id: activeWeek.id,
      player_1_id: selectedPlayers[0]?.id || null,
      player_2_id: selectedPlayers[1]?.id || null,
      player_3_id: selectedPlayers[2]?.id || null,
      player_4_id: selectedPlayers[3]?.id || null,
      player_5_id: selectedPlayers[4]?.id || null,
      coach_id: selectedCoach?.id || null,
      total_value_spent: currentBudgetSpent,
      updated_at: new Date().toISOString(),
    };

    try {
      const { data: existingTeam, error: fetchError } = await supabase
        .from('user_teams')
        .select('id')
        .eq('user_id', user.id)
        .eq('week_id', activeWeek.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingTeam) {
        const { error: updateError } = await supabase
          .from('user_teams')
          .update(teamPayload)
          .eq('id', existingTeam.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('user_teams')
          .insert(teamPayload);
        if (insertError) throw insertError;
      }
      setSuccessMessage('Équipe sauvegardée avec succès !');
    } catch (err) {
      setError(`Erreur sauvegarde équipe: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !activeWeek) return <p style={{padding: '20px', textAlign: 'center'}}>Chargement des données de la semaine...</p>;
  if (error) return <p style={{ color: 'red', padding: '20px', textAlign: 'center' }}>Erreur: {error}</p>;
  if (!activeWeek && !loading) return <p style={{padding: '20px', textAlign: 'center'}}>Aucune semaine de jeu active pour le moment. Revenez plus tard !</p>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
        <h2>Sélection d'équipe pour la Semaine {activeWeek?.week_number}</h2>
        {lockTime && <p style={{fontSize: '1.1em', fontWeight: 'bold', color: isTeamLocked() ? 'red' : '#333'}}>Verrouillage des équipes : {timeRemaining}</p>}
        <h3 style={{marginTop: '10px'}}>Budget: <span style={{color: budgetRemaining < 0 ? 'red' : 'green', fontWeight: 'bold'}}>{budgetRemaining}</span> / {MAX_BUDGET}</h3>
        <p>Joueuses: {selectedPlayers.length}/{MAX_PLAYERS} | Coach: {selectedCoach ? 1 : 0}/{MAX_COACHES}</p>
      </div>

      {successMessage && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>{successMessage}</p>}

      <section>
        <h4 style={{borderBottom: '2px solid #eee', paddingBottom: '5px', marginBottom: '15px'}}>Joueuses ({availablePlayers.length} disponibles)</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {availablePlayers.map(p => (
            <PlayerCard
              key={p.id}
              player={p}
              type="player"
              onSelect={handleSelectPlayer}
              isSelected={selectedPlayers.some(sp => sp.id === p.id)}
              budgetRemaining={budgetRemaining + (selectedPlayers.some(sp => sp.id === p.id) ? p.value : 0)}
              disabled={
                isTeamLocked() ||
                (selectedPlayers.length >= MAX_PLAYERS && !selectedPlayers.some(sp => sp.id === p.id))
              }
            />
          ))}
        </div>
      </section>

      <section style={{marginTop: '30px'}}>
        <h4 style={{borderBottom: '2px solid #eee', paddingBottom: '5px', marginBottom: '15px'}}>Coachs ({availableCoaches.length} disponibles)</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {availableCoaches.map(c => (
            <PlayerCard
              key={c.id}
              player={c}
              type="coach"
              onSelect={handleSelectCoach}
              isSelected={selectedCoach?.id === c.id}
              budgetRemaining={budgetRemaining + (selectedCoach?.id === c.id ? c.value : 0)}
              disabled={
                isTeamLocked() ||
                (!!selectedCoach && selectedCoach.id !== c.id)
              }
            />
          ))}
        </div>
      </section>
      
      {!isTeamLocked() && (
        <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button 
                onClick={handleSaveTeam} 
                disabled={loading || selectedPlayers.length !== MAX_PLAYERS || !selectedCoach || budgetRemaining < 0} 
                style={{
                    padding: '12px 25px', 
                    fontSize: '1.2em', 
                    background: (selectedPlayers.length !== MAX_PLAYERS || !selectedCoach || budgetRemaining < 0) ? '#ccc' : 'green', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px',
                    cursor: (selectedPlayers.length !== MAX_PLAYERS || !selectedCoach || budgetRemaining < 0) ? 'not-allowed' : 'pointer'
                }}
            >
            {loading ? 'Sauvegarde...' : 'Valider et Sauvegarder l\'équipe'}
            </button>
        </div>
      )}
      {isTeamLocked() && <p style={{color: 'orange', fontWeight: 'bold', textAlign: 'center', marginTop: '30px', fontSize: '1.2em'}}>Les modifications ne sont plus possibles pour cette semaine.</p>}
    </div>
  );
}

export default TeamSelection;