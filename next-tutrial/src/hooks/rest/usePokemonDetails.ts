import { useEffect, useState } from 'react';

export type PokemonDetailProps = {
  name: string;
  image?: string;
  types: string[];
  abilities?: string[];
};

export type IndexProps = {
  index: string;
};

export const useFetchPokemonDetails = (index: IndexProps) => {
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetailProps>();
  const [log, setLog] = useState<string>();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        // index がオブジェクトの場合、その値を取得
        const indexValue = typeof index === 'string' ? index : index.index;
        const url = `https://pokeapi.co/api/v2/pokemon/${indexValue}/`;

        console.log('url', url);
        console.log('value', indexValue);

        const res = await fetch(url);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to fetch Pokémon details: ${errorText}`);
        }

        const details = await res.json();
        setLog(`https://pokeapi.co/api/v2/pokemon/${index}/`);

        const pokemonDetail: PokemonDetailProps = {
          name: details.name,
          image:
            details.sprites.other['official-artwork'].front_default ||
            details.sprites.front_default,
          types: details.types.map((type: any) => type.type.name),
          abilities: details.abilities.map(
            (ability: any) => ability.ability.name
          ),
        };

        setPokemonDetail(pokemonDetail);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    };

    fetchPokemonDetails();
  }, []);

  // useEffect(() => {
  //   console.log('🩵', index);
  // }, [index]);

  return { pokemonDetail };
};
