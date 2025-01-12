import { usePokemonContext } from '@/context/PokemonContext';
import { PokemonDetailProps } from '.';
import { StyledContainer } from './styled';

const Component = (pokemonDetail: PokemonDetailProps) => {
  const { selectedPokemonImage, selectedPokemonUrl } = usePokemonContext();
  // const { pokemonDetail } = usePokemonDetails(selectedPokemonUrl);
  const imageSize = 240;
  const { name, image, type, encount, capture_rate } = pokemonDetail;

  console.log('🟦', pokemonDetail, );

  return (
    <>
      <StyledContainer>
        {/* <p>{name}</p>
        <img
          src={selectedPokemonImage || ''}
          alt=''
          width={imageSize}
          height={imageSize}
        />
        <p>タイプ：{type}</p>
        <p>遭遇率：{encount}%</p>
        <p>捕獲率：{capture_rate}%</p> */}
        <p></p>
      </StyledContainer>
    </>
  );
};

export default Component;
