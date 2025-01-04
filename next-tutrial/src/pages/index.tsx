import List from '@/component/List';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchPokemonList } from './api/poke-rest';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

// export async function getServerSideProps() {
//   // pokemonDataList?.results が undefined の場合は空の配列 [] を代わりに渡す
//   const pokemons = (await fetchPokemonList()) || [];

//   return {
//     props: { pokemons },
//   };
// }

export default function Home() {
  let id: number = 1;
  const router = useRouter();

  const handleUrlUpdate = () => {
    router.push('/?category=10', undefined, { shallow: true });
  };

  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPokemonList();
      setPokemons(data);
    };

    fetchData();
    console.log('Pokemons in Home:', pokemons); // デバッグ用
  }, [fetchPokemonList]);

  return (
    // <div
    //   className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    // >
    //   <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
    //     {/* 768px以上の時のみ表示 */}
    //     {/* <Image src={cat} alt='cat1' />
    //     <Image src={cat_mobile} alt='cat2' className='hidden md:block' /> */}

    //     {/* ナビゲーション */}
    //     {/* 静的パス */}
    //     {/* <Link href='/about'>About</Link> */}
    //     {/* 動的パス */}
    //     {/* <Link href={`/about/${id}`}>About/id</Link> */}
    //     {/* ext/routerでの画面遷移 */}
    //     {/* <button onClick={() => router.push('/about')}>About</button> */}
    //     {/* ページは置き換えられずURLを変更 */}
    //     {/* <button onClick={handleUrlUpdate}>画面遷移なしでURL更新</button> */}
    //   </main>
    // </div>
    <div>
      <List items={pokemons}></List>
    </div>
  );
}
