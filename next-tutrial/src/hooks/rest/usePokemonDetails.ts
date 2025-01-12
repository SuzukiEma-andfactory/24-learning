import { useEffect, useState } from 'react';

export type PokemonDetailProps = {
  name: string;
  image?: string;
  types: string[];
  abilities?: string[];
};

export type PokemonSpeciesDetailProps = {
  capture_rate: number;
  genera: string;
  habitat: string;
};

export type IndexProps = {
  index: string;
};

export const useFetchPokemonDetails = (index: IndexProps) => {
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetailProps>();
  const [pokemonSpeciesDetail, setpokemonSpeciesDetail] =
    useState<PokemonSpeciesDetailProps>();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        // indexはオブジェクトで返ってくるので、index.indexで値を取得
        const indexValue = typeof index === 'string' ? index : index.index;

        // 能力、高さ、重さ、画像
        const url = `https://pokeapi.co/api/v2/pokemon/${indexValue}/`;
        // 遭遇率、場所、捕獲率、ジャンル、進化情報
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${indexValue}/`;

        const res = await fetch(url);
        const speciesRes = await fetch(speciesUrl);

        const checkResponse = async (
          response: Response,
          errorMessage: string
        ) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`${errorMessage}: ${errorText}`);
          }
        };

        await checkResponse(res, 'Failed to fetch Pokémon details');
        await checkResponse(
          speciesRes,
          'Failed to fetch Pokémon species details'
        );

        if (!speciesRes.ok) {
          const errorText = await speciesRes.text();
          throw new Error(
            `Failed to fetch Pokémon species details: ${errorText}`
          );
        }

        const details = await res.json();
        const details2 = await speciesRes.json();

        // console.log('🔮', details);
        // console.log('🌈', details2);

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

        const pokemonSpeciesDetail: PokemonSpeciesDetailProps = {
          capture_rate: details2.capture_rate,
          genera: details2.genera[0].genus,
          habitat: details2.habitat.name,
        };

        setPokemonDetail(pokemonDetail);
        setpokemonSpeciesDetail(pokemonSpeciesDetail);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        }
      }
    };

    fetchPokemonDetails();
  }, []);

  // useEffect(() => {
  //   console.log('🩵', pokemonDetail);
  // }, [pokemonDetail]);

  return { pokemonDetail };
};
