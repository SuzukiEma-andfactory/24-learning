import { useEffect, useState } from 'react';

export type PokemonData = {
  name: string;
  image: string;
};

export const usePokemonData = () => {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=10`
        );
        const data = await response.json();

        // 一覧に表示する要素
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const res = await fetch(pokemon.url);
            // ポケモンのタイプ、重さ、能力の情報
            const details = await res.json();

            return {
              name: pokemon.name,
              image:
                details.sprites.other['official-artwork'].front_default ||
                // ドット絵
                details.sprites.front_default,
            };
          })
        );

        setPokemonList(pokemonDetails);
      } catch (err) {
        console.error('ポケモンデータの取得に失敗しました:', err);
      }
    };

    fetchPokemonData();
  }, []);

  return pokemonList;
};

export default usePokemonData;
