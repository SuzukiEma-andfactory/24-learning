import List from '@/component/List';
import { useRouter } from 'next/router';
import { styled } from 'styled-components';
import usePokemonData from './api/poke-rest';

// const geistSans = localFont({
//   src: './fonts/GeistVF.woff',
//   variable: '--font-geist-sans',
//   weight: '100 900',
// });
// const geistMono = localFont({
//   src: './fonts/GeistMonoVF.woff',
//   variable: '--font-geist-mono',
//   weight: '100 900',
// });

const StyledContainer = styled.div`
  padding: 40px;
`;

export default function Home() {
  let id: number = 1;
  const router = useRouter();

  // const handleUrlUpdate = () => {
  //   router.push('/?category=10', undefined, { shallow: true });
  // };

  const { query } = router;
  const page = query.page ? parseInt(query.page as string, 10) : 1;
  const limit = 99;
  const { pokemonList } = usePokemonData(limit);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    router.push(`/?page=${value}`, undefined, { shallow: true });
  };

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
    <StyledContainer>
      <List items={pokemonList}></List>
    </StyledContainer>
  );
}
