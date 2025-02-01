import { GetPokemonDetailQuery, getSdk } from '@/repositories/graphql';
import { GraphQLClient } from 'graphql-request';
import { useEffect, useState } from 'react';

// pokemonsは配列だが[number]でオブジェクトとして型を取得し拡張
export type PokemonDetail = GetPokemonDetailQuery['pokemons'][number] & {
  id: number;
  image: string;
};

export const usePokemonDetail = (id: number) => {
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail>();

  // console.log('🟦', id);

  useEffect(() => {
    const fetchPokemonData = async () => {
      if (!id) return;
      const endpoint = 'https://beta.pokeapi.co/graphql/v1beta';
      const client = new GraphQLClient(endpoint);
      const sdk = getSdk(client);

      sdk.GetPokemonDetail({ id }).then((res) => {
        const data: PokemonDetail = {
          ...res.pokemons[0],
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${res.pokemons[0].id}.png`,
        };
        setPokemonDetail(data as PokemonDetail);
      });
    };

    fetchPokemonData();
  }, []);

  return { pokemonDetail };
};

export default usePokemonDetail;
