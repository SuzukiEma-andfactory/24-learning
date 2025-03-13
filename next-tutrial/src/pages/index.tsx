import Layout from '@/components/Layout';
import usePokemonIndex from '@/hooks/graphql/usePokemonIndex';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { styled } from 'styled-components';
import cat1Image from '/public/cat.jpg';
// import cat1Image from '@/images/cat.jpg';
import { getSortedPostsData } from '../lib/posts';

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

type PostData = {
  id: string;
};

type Props = {
  allPostsData: PostData[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};

export default function Home({ allPostsData }: any) {
  let id: number = 1;
  const router = useRouter();

  // const handleUrlUpdate = () => {
  //   router.push('/?category=10', undefined, { shallow: true });
  // };

  // const limit = 99;

  const { pokemonList } = usePokemonIndex();

  return (
    <Layout>
      {/* <div
        className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
      >
        <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'> */}
      {/* 768px以上の時のみ表示 */}
      {/* <Image src={cat} alt='cat1' />
        <Image src={cat_mobile} alt='cat2' className='hidden md:block' /> */}

      {/* ナビゲーション */}
      {/* 静的パス */}
      {/* <Link href='/about'>About</Link> */}
      {/* 動的パス */}
      {/* <Link href={`/about/${id}`}>About/id</Link> */}
      {/* ext/routerでの画面遷移 */}
      {/* <button onClick={() => router.push('/about')}>About</button> */}
      {/* ページは置き換えられずURLを変更 */}
      {/* <button onClick={handleUrlUpdate}>画面遷移なしでURL更新</button> */}
      {/* </main>
      </div>
      <StyledContainer>
        <List items={pokemonList}></List>
      </StyledContainer> */}

      {/* <section>
        <h2>Blog</h2>
        <ul>
          {allPostsData.map(
            ({
              id,
              date,
              title,
            }: {
              id: number;
              date: string;
              title: string;
            }) => (
              <li key={id}>
                {title}
                <br />
                {id}
                <br />
                {date}
              </li>
            )
          )}
        </ul>
      </section> */}

      {/* configでの設定が不要な場合 */}
      {/* Imageにfill、親要素にposition: 'relative'を指定するとサイズしてしなくても親要素いっぱいに広がってくれる */}
      {/* スタイルはtailwindで指定している */}
      <div className='relative aspect-video'>
        {/* objectFitがcontainなら画像自体が見切れないように、coverなら見切れるけど親要素の領域を埋めるように表示 */}
        <Image
          src={cat1Image}
          alt='cat1'
          fill
          className='object-cover'
          placeholder='blur'
          blurDataURL='/svg_icon.svg'
        />
      </div>

      {/* configでの設定が必要な場合 */}
      <Image
        src='https://user0514.cdnw.net/shared/img/thumb/nekocyan458A5353_TP_V.jpg'
        alt='cat2'
        width={400}
        height={400}
      />

      <Image src='/svg_icon.svg' alt='' unoptimized width={80} height={80} />
    </Layout>
  );
}
