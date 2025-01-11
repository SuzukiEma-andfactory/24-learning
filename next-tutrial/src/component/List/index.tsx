import { PokemonData } from '@/pages/hooks/rest/usePokemonData';
import Component from './component';

const List = ({ items }: { items: PokemonData[] }) => {
  return <Component items={items} />;
};

export default List;
