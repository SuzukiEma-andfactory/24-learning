import Layout from '@/components/Layout';
import List from '@/components/List';
import usePokemonIndex from '@/hooks/graphql/usePokemonIndex';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { styled } from 'styled-components';

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

  // const limit = 99;

  const { pokemonList } = usePokemonIndex();

  return (
    <>
      <Layout>
        <StyledContainer>
          <List items={pokemonList}></List>
        </StyledContainer>
      </Layout>

      {/* スクリプトの読み込みタイミングを指定できる */}
      <Script
        // ロードするスクリプトのURL（ここではFacebook SDKのURLを使う）
        src='https://connect.facebook.net/en_US/sdk.js'
        // ページの読み込み完了後にスクリプトをロード
        strategy='lazyOnload'
        // スクリプトが正しくロードされたら実行
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
    </>

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
  );
}
