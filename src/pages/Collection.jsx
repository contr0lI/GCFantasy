import React from 'react';

function CollectionPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>FAQ (Foire Aux Questions)</h1>
      <section style={{ marginBottom: '20px' }}>
        <h2>Comment fonctionne le scoring ?</h2>
        <p>Les points sont attribués en fonction des Kills, Assists, Deaths, victoires d'équipe, First Bloods, Clutchs, et performances MVP. Chaque statistique a une valeur en points spécifique.</p>
        <p><em>(Détails précis à ajouter ici une fois les règles finalisées)</em></p>
      </section>
      <section style={{ marginBottom: '20px' }}>
        <h2>Quelles sont les récompenses ?</h2>
        <p>Vous pouvez gagner des cartes de joueuses/coachs collectionnables (virtuelles) en fonction de votre classement hebdomadaire. Des packs de récompenses pourront être ouverts pour découvrir vos nouvelles cartes.</p>
        <p>Les meilleurs joueurs (Top 10%, Top 25%) recevront des récompenses plus importantes.</p>
      </section>
      <section style={{ marginBottom: '20px' }}>
        <h2>Quand les équipes sont-elles verrouillées ?</h2>
        <p>Vous devez finaliser votre équipe avant le début des premiers matchs de la semaine. Un compte à rebours sera affiché sur la page de sélection d'équipe.</p>
      </section>
      <section>
        <h2>Je suis débutant(e), par où commencer ?</h2>
        <p>Commencez par consulter la page "Règles du jeu" pour bien comprendre le fonctionnement. Ensuite, créez un compte, et essayez de composer votre première équipe en respectant le budget. N'hésitez pas à expérimenter !</p>
      </section>
    </div>
  );
}
export default CollectionPage;
