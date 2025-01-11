import { usePokemonContext } from '@/context/PokemonContext';
import usePokemonDetails from '@/pages/hooks/rest/usePokemonDetails';
import Component from './component';

const PokemonDetail = () => {
  const { selectedPokemonUrl } = usePokemonContext();
  const { pokemonDetail } = usePokemonDetails(selectedPokemonUrl);

  return <Component />;
};

export default PokemonDetail;
