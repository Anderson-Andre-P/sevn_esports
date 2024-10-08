const teamShields = {
  'time-a': 'team_shield_a.png',
  'time-b': 'team_shield_b.png',
  'time-c': 'team_shield_c.png',
  'time-d': 'team_shield_d.png',
  'time-e': 'team_shield_e.png',
  'time-f': 'team_shield_f.png',
  'time-g': 'team_shield_g.png',
  'time-h': 'team_shield_h.png',
};

const apiUrl = 'https://sevn-pleno-esportes.deno.dev/';
let currentRound = 1;
let maxRounds = 0;

async function fetchRoundData(round) {
  try {
    const response = await fetch(`${apiUrl}`);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar os dados da API:', error);
    return null;
  }
}

function renderGames(games) {
  const gamesList = document.getElementById('rounds__games-list');
  gamesList.innerHTML = '';

  if (!games || games.length === 0) {
    gamesList.innerHTML = '<li>Nenhum jogo encontrado para essa rodada</li>';
    return;
  }

  games.forEach((game) => {
    if (!game.team_home_id || !game.team_away_id) {
      console.error('Dados do jogo incompletos:', game);
      return;
    }

    const homeShield = teamShields[game.team_home_id] || 'default_shield.png';
    const awayShield = teamShields[game.team_away_id] || 'default_shield.png';

    console.log('Home Shield:', homeShield, 'Away Shield:', awayShield);

    const gameItem = document.createElement('li');

    gameItem.innerHTML = `
      <div class="team">
        <img src="assets/images/${homeShield}" alt="${game.team_home_name} logo">
        <span class="team-name">${game.team_home_name}</span>
      </div>
      <span class="score">${game.team_home_score} <span class="divider">X</span> ${game.team_away_score}</span>
      <div class="team">
        <img src="assets/images/${awayShield}" alt="${game.team_away_name} logo">
        <span class="team-name">${game.team_away_name}</span>
      </div>
    `;

    gamesList.appendChild(gameItem);
  });
}

async function updateRound(round) {
  const data = await fetchRoundData(round);

  if (!data) {
    document.getElementById('rounds__games-list').innerHTML = '<li>Erro ao carregar dados.</li>';
    return;
  }

  document.getElementsByClassName('rounds__round-number').textContent = `Rodada ${round}`;

  if (data[round - 1]) {
    renderGames(data[round - 1].games);
  } else {
    document.getElementsId('rounds__games-list').innerHTML = '<li>Rodada não encontrada.</li>';
  }

  currentRound = round;
  maxRounds = data.length;

  document.getElementById('rounds__button rounds__button--prev').disabled = round === 1;
  document.getElementById('rounds__button rounds__button--next').disabled = round === maxRounds;
}

document.addEventListener('DOMContentLoaded', () => {
  updateRound(currentRound);

  document.getElementById('rounds__button rounds__button--prev').addEventListener('click', () => {
    if (currentRound > 1) {
      updateRound(currentRound - 1);
    }
  });

  document.getElementById('rounds__button rounds__button--next').addEventListener('click', () => {
    if (currentRound < maxRounds) {
      updateRound(currentRound + 1);
    }
  });
});
