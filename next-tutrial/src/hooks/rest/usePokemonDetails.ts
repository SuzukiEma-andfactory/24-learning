import { useEffect, useState } from 'react';

export type PokemonDetail = {
  name: string;
  image?: string;
  encount: string;
  type: string[];
  capture_rate: number;
  abilities?: string[];
};

export const usePokemonDetails = (url: string | null) => {
  const [pokemonDetail, setPokemonDetail] = useState<PokemonDetail | null>(
    null
  );
  const [apiUrl, setApiUrl] = useState<string | null>(url);

  const fetchPokemonDetails = async (url: string) => {
    try {
      const res = await fetch(url);
      const details = await res.json();

      const pokemonDetail = {
        name: details.names[0].name,
        type: details.genera[0].genus,
        encount: details.pal_park_encounters[0].rate,
        capture_rate: details.capture_rate,
      };

      setPokemonDetail(pokemonDetail);
      // console.log('🟣', pokemonDetail);
    } catch (err) {
      console.error('ポケモンデータの取得に失敗しました:', err);
    }
  };

  useEffect(() => {
    if (apiUrl) {
      fetchPokemonDetails(apiUrl);
    }
  }, [apiUrl]);

  return { pokemonDetail, setApiUrl };
};

export default usePokemonDetails;
