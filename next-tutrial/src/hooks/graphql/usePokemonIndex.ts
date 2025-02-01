import { getSdk } from '@/repositories/graphql';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';

export type PokemonData = {
  id: number;
  name: string;
  image?: string;
};

export const usePokemonIndex = (limit?: number, detail?: boolean) => {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonData>();

  useEffect(() => {
    const fetchPokemonData = async () => {
      // ポケモン一覧取得
      const endpoint = 'https://beta.pokeapi.co/graphql/v1beta';
      const client = new GraphQLClient(endpoint);
      const sdk = getSdk(client);

      sdk.GetPokemons().then((res) => {
        const data = res.pokemons.map((pokemon) => ({
          ...pokemon,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
        }));
        setPokemonList(data as PokemonData[]);
        // console.log('🟦', data);
      });
    };

    fetchPokemonData();
  }, []);

  return { pokemonList, pokemonDetails };
};

export default usePokemonIndex;
