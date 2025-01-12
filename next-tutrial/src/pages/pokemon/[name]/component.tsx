import { usePokemonContext } from '@/context/PokemonContext';
import { StyledContainer } from './styled';
import usePokemonDetails from '@/pages/hooks/rest/usePokemonDetails';

const Component = () => {
  const { selectedPokemonImage, selectedPokemonUrl } = usePokemonContext();
  const { pokemonDetail } = usePokemonDetails(selectedPokemonUrl);
  const imageSize = 240;

  return (
    <>
      <StyledContainer>
        <p>{pokemonDetail?.name}</p>
        <img
          src={selectedPokemonImage || ''}
          alt=''
          width={imageSize}
          height={imageSize}
        />
        <p>タイプ：{pokemonDetail?.type}</p>
        <p>遭遇率：{pokemonDetail?.encount}%</p>
        <p>捕獲率：{pokemonDetail?.capture_rate}%</p>
      </StyledContainer>
    </>
  );
};

export default Component;
