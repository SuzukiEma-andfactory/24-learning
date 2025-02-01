import usePokemonDetail from '@/hooks/graphql/usePokemonDetail';
import { IndexProps } from '@/hooks/rest/usePokemonDetails';
import { GetServerSideProps } from 'next';
import Component from './component';

const PokemonDetail: React.FC<IndexProps> = ({ id }) => {
  // rest api
  // const { pokemonDetail, pokemonSpeciesDetail } = useFetchPokemonDetails(
  //   index as IndexProps
  // );

  // graphql
  const IntId = parseInt(id);
  const { pokemonDetail } = usePokemonDetail(IntId);

  return (
    <Component
      pokemonDetail={pokemonDetail}
      // pokemonSpeciesDetail={pokemonSpeciesDetail}
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  if (!id) {
    return {
      notFound: true, // 404 ページを表示
    };
  }

  return {
    props: {
      id,
    },
  };
};

export default PokemonDetail;
