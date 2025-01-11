import { useState } from 'react';

export type PokemonDetail = {
  name: string;
  image: string;
  types: string[];
  weight: number;
  abilities: string[];
};

export const usePokemonDetails = (url: string | null) => {
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(
    null
  );

  const fetchPokemonDetails = async (url: string) => {
    try {
      const res = await fetch(url);
      const details = await res.json();
      console.log('🟢', details);

      const speciesRes = await fetch(details.species.url).then((res) =>
        res.json()
      );

      const pokemonDetail = {
        name: speciesRes.names[0].name,
        image:
          details.sprites.other['official-artwork'].front_default ||
          details.sprites.front_default,
        types: details.types.map((type: any) => type.type.name),
        weight: details.weight / 10, // 重さをkgに変換
        abilities: details.abilities.map(
          (ability: any) => ability.ability.name
        ),
      };

      setPokemonDetail(pokemonDetail);
    } catch (err) {
      console.error('ポケモンデータの取得に失敗しました:', err);
    }
  };

  if (url) {
    fetchPokemonDetails(url);
  }

  return { pokemonDetail };
};

export default usePokemonDetails;
