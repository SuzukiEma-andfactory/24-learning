import {
  IndexProps,
  useFetchPokemonDetails,
} from '@/hooks/rest/usePokemonDetails';
import { GetServerSideProps } from 'next';
import Component from './component';

export type PokemonDetailProps = {
  name?: string;
  image?: string;
  encount?: string;
  type?: string[];
  capture_rate?: number;
  abilities?: string[];
};

const PokemonDetail: React.FC<PokemonDetailProps> = (index) => {
  const { pokemonDetail } = useFetchPokemonDetails(index as IndexProps);

  return <Component {...pokemonDetail} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  // context.paramsの型が ParsedUrlQuery | undefined であり、TypeScriptによって indexプロパティが存在する保証がないと判断されるため、!でクエリパラメータが存在することを明示
  const { index } = context.params!;

  if (!index) {
    return {
      notFound: true, // 404 ページを表示
    };
  }

  return {
    props: {
      index,
    },
  };
};

export default PokemonDetail;
