import { useEffect, useState } from 'react';

export type PokemonDetailProps = {
  image?: string;
  types: string[];
  abilities?: string[];
};

export type PokemonSpeciesDetailProps = {
  name: string;
  capture_rate: number;
  genera: string;
  habitat: string;
};

export type IndexProps = {
  id: string;
};

export const useFetchPokemonDetails = (index: IndexProps) => {
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetailProps>();
  const [pokemonSpeciesDetail, setpokemonSpeciesDetail] =
    useState<PokemonSpeciesDetailProps>();

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        // indexはオブジェクトで返ってくるので、index.indexで値を取得
        const id = typeof index === 'string' ? index : index.id;

        // 能力、高さ、重さ、画像
        const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
        // 遭遇率、場所、捕獲率、ジャンル、進化情報
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

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
        const speciesdetails = await speciesRes.json();

        // console.log('🔮', details);
        // console.log('🌈', speciesdetails);

        const pokemonDetail: PokemonDetailProps = {
          image:
            details.sprites.other['official-artwork'].front_default ||
            details.sprites.front_default,
          types: details.types.map((type: any) => type.type.name),
          abilities: details.abilities.map(
            (ability: any) => ability.ability.name
          ),
        };

        const pokemonSpeciesDetail: PokemonSpeciesDetailProps = {
          name: speciesdetails.names[0].name,
          capture_rate: speciesdetails.capture_rate,
          genera: speciesdetails.genera[0].genus,
          habitat: speciesdetails.habitat.name,
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

  return { pokemonDetail, pokemonSpeciesDetail };
};
