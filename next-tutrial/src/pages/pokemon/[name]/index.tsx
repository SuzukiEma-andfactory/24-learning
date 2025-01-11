import usePokemonData from '@/pages/hooks/rest/usePokemonData';
import Component from './component';

const PokemonDetail = () => {
  const { pokemonList } = usePokemonData(undefined, true);
  // console.log('🟦', pokemonList)

  return <Component />;
};

export default PokemonDetail;
