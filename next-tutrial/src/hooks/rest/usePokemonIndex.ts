import { useEffect, useState } from 'react';

export type PokemonData = {
  id: number;
  name: string;
  image: string;
  url: string;
};

export const usePokemonIndex = (limit?: number, detail?: boolean) => {
  const [pokemonList, setPokemonList] = useState<PokemonData[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonData>();

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        // ポケモン一覧取得
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?&limit=${limit}`
        );
        const data = await response.json();

        // ポケモン一覧で表示する要素を取得
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: { name: string; url: string }) => {
            const res = await fetch(pokemon.url);
            // ポケモンのタイプ、重さ、能力の情報
            const details = await res.json();

            // 日本語の名前を取得するのに必要
            // fetch関数、json関数はPromise（非同期処理の進行状況を管理するオブジェクト）を返す
            // 非同期処理の完了前、namesにアクセス不可なので処理の完了待機する（await）必要がある
            const speciesRes = await fetch(details.species.url).then((res) =>
              res.json()
            );

            setPokemonDetails(speciesRes);

            return {
              id: details.id,
              // 日本語の名前を取得
              name: speciesRes.names[0].name,
              image:
                details.sprites.other['official-artwork'].front_default ||
                // ドット絵
                details.sprites.front_default,
              url: details.species.url,
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

  return { pokemonList, pokemonDetails };
};

export default usePokemonIndex;
