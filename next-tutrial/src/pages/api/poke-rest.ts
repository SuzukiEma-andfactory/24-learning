export async function fetchPokemonList() {
  const url = `https:pokeapi.co/api/v2/pokemon/?limit=30`;

  const response = await fetch(url);
  const data = await response.json();

  console.log('🟦', data.results)
  return data.results;
}
