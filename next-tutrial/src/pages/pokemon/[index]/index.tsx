import {
  IndexProps,
  useFetchPokemonDetails,
} from '@/hooks/rest/usePokemonDetails';
import { GetServerSideProps } from 'next';
import Component from './component';

const PokemonDetail: React.FC<IndexProps> = (index) => {
  const { pokemonDetail, pokemonSpeciesDetail } = useFetchPokemonDetails(
    index as IndexProps
  );

  return (
    <Component
      pokemonDetail={pokemonDetail}
      pokemonSpeciesDetail={pokemonSpeciesDetail}
    />
  );
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
