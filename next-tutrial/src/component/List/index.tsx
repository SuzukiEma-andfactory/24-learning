// import { PokemonData } from '@/hooks/rest/usePokemonIndex';
import { PokemonData } from '@/hooks/graphql/usePokemonIndex';
import Component from './component';

const List = ({ items }: { items: PokemonData[] }) => {
  return <Component items={items} />;
};

export default List;
