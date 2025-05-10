import React from 'react';

function RulesPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Règles du Jeu</h1>
      <section style={{ marginBottom: '20px' }}>
        <h2>1. Création d'Équipe Hebdomadaire</h2>
        <ul>
          <li>Chaque semaine, vous devez composer une équipe de 5 joueuses et 1 coach.</li>
          <li>Chaque joueuse et coach a une valeur en points.</li>
          <li>Vous disposez d'un budget maximum (par exemple, 100 points) que vous ne devez pas dépasser.</li>
          <li>Votre équipe doit être validée avant la date et l'heure de verrouillage indiquées (généralement avant le début des matchs de la semaine).</li>
        </ul>
      </section>
      <section style={{ marginBottom: '20px' }}>
        <h2>2. Scoring</h2>
        <p>Les points de fantasy sont calculés en fonction des performances réelles des joueuses lors des matchs de la semaine. Voici un exemple de barème (les valeurs exactes seront confirmées) :</p>
        <ul>
          <li>Kill : +X points</li>
          <li>Assist : +Y points</li>
          <li>Death : -Z points</li>
          <li>Victoire de l'équipe de la joueuse (par match) : +A points</li>
          <li>First Blood (par match) : +B points</li>
          <li>Clutch réussi (par match) : +C points</li>
          <li>MVP du match : +D points</li>
          {/* Ajoutez d'autres critères de scoring si nécessaire */}
        </ul>
        <p>Le score de votre équipe est la somme des scores de vos 5 joueuses. Le coach peut également apporter des points (ex: si son équipe IRL gagne).</p>
      </section>
      <section style={{ marginBottom: '20px' }}>
        <h2>3. Classement et Récompenses</h2>
        <ul>
          <li>Un classement hebdomadaire sera établi en fonction des scores de chaque participant.</li>
          <li>Un classement général cumulera les scores sur plusieurs semaines.</li>
          <li>Des récompenses (cartes collectionnables, packs) seront distribuées aux meilleurs participants (par exemple, top 10%, top 25% du classement hebdomadaire).</li>
        </ul>
      </section>
      <section>
        <h2>4. Calendrier</h2>
        <p>Le calendrier des semaines de jeu et des matchs pris en compte sera communiqué ici et sur les annonces de la ligue.</p>
        {/* Intégrer un calendrier ou des dates clés ici */}
      </section>
    </div>
  );
}

export default RulesPage;