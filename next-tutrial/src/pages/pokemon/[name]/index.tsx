import usePokemonIndex from '@/pages/hooks/rest/usePokemonIndex';
import Component from './component';

const PokemonDetail = () => {
  const { pokemonList } = usePokemonIndex(undefined, true);
  // console.log('🟦', pokemonList)

  return <Component />;
};

export default PokemonDetail;
