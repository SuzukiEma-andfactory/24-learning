import { PokemonDetail } from '@/hooks/graphql/usePokemonDetail';
import {
  // PokemonDetailProps,
  PokemonSpeciesDetailProps,
} from '@/hooks/rest/usePokemonDetails';
import { clsx } from 'clsx';
import styles from './style.module.css';
import { StyledContainer } from './styled';

// type Props = {
//   pokemonDetail: PokemonDetailProps | undefined;
//   pokemonSpeciesDetail?: PokemonSpeciesDetailProps | undefined;
// };

type Props = {
  pokemonDetail: PokemonDetail | undefined;
  pokemonSpeciesDetail?: PokemonSpeciesDetailProps | undefined;
};

const Component = ({ pokemonDetail, pokemonSpeciesDetail }: Props) => {
  const imageSize = 240;

  return (
    <>
      <StyledContainer>
        {/* rest api */}
        {/* <p>{pokemonSpeciesDetail?.name}</p> */}
        {/* <img
          src={pokemonDetail?.image
          alt={`${pokemonSpeciesDetail?.name}の画像`}
          width={imageSize}
          height={imageSize}
        />
        <p>タイプ：{pokemonDetail?.types?.join(', ')}</p>
        <p>分類：{pokemonSpeciesDetail?.genera}</p>
        <p>能力：{pokemonDetail?.abilities?.join(', ')}</p>
        <p>生息地：{pokemonSpeciesDetail?.habitat}</p>
        <p>捕獲率：{pokemonSpeciesDetail?.capture_rate}%</p> */}

        {/* graphql */}
        <p>{pokemonDetail?.name}</p>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonDetail?.id}.png`}
          alt={`${pokemonDetail?.name}の画像`}
          width={imageSize}
          height={imageSize}
        />
        <p>分類：{pokemonDetail?.base_happiness}</p>
        <p>捕まえやすさ：{pokemonDetail?.capture_rate}</p>
        <p>初期のなつき度：{pokemonDetail?.base_happiness}</p>
        {/* 該当ポケモン：zapdos */}
        <p
          className={clsx({
            [styles.legendary]: pokemonDetail?.is_legendary,
          })}
        >
          伝説のポケモン：{pokemonDetail?.is_legendary ? 'はい' : 'いいえ'}
        </p>
        <p
          className={clsx({
            [styles.mythical]: pokemonDetail?.is_mythical,
          })}
        >
          幻のポケモン：{pokemonDetail?.is_mythical ? 'はい' : 'いいえ'}
        </p>
      </StyledContainer>
    </>
  );
};

export default Component;
