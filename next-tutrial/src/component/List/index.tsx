import { PokemonData } from '@/pages/api/poke-rest';
import Component from './component';

const List = ({ items }: { items: PokemonData[] }) => {
  return <Component items={items} />;
};

export default List;
