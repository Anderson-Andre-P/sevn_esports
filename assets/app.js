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
