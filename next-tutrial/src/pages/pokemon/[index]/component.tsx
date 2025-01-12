import {
  PokemonDetailProps,
  PokemonSpeciesDetailProps,
} from '@/hooks/rest/usePokemonDetails';
import { StyledContainer } from './styled';

type Props = {
  pokemonDetail: PokemonDetailProps | undefined;
  pokemonSpeciesDetail: PokemonSpeciesDetailProps | undefined;
};

const Component = ({ pokemonDetail, pokemonSpeciesDetail }: Props) => {
  const imageSize = 240;

  return (
    <>
      <StyledContainer>
        <p>{pokemonSpeciesDetail?.name}</p>
        <img
          src={pokemonDetail?.image || `${pokemonSpeciesDetail?.name}の画像`}
          alt=''
          width={imageSize}
          height={imageSize}
        />
        <p>タイプ：{pokemonDetail?.types?.join(', ')}</p>
        <p>分類：{pokemonSpeciesDetail?.genera}</p>
        <p>能力：{pokemonDetail?.abilities?.join(', ')}</p>
        <p>生息地：{pokemonSpeciesDetail?.habitat}</p>
        <p>捕獲率：{pokemonSpeciesDetail?.capture_rate}%</p>
      </StyledContainer>
    </>
  );
};

export default Component;
