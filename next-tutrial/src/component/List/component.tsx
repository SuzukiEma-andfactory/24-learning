import { usePokemonContext } from '@/context/PokemonContext';
import { PokemonData } from '@/hooks/rest/usePokemonIndex';
import Image from 'next/image';
import Link from 'next/link';
import { styled } from 'styled-components';
import * as Styled from './styled';

const StyledLink = styled(Link)`
  width: 100%;
`;

const Component = ({ items }: { items: PokemonData[] }) => {
  const { setSelectedPokemonUrl, setSelectedPokemonImage } =
    usePokemonContext();

  const handleClick = (url: string, image: string) => {
    setSelectedPokemonUrl(url);
    setSelectedPokemonImage(image);
  };

  return (
    <>
      <Styled.MuiGridList columns={3}>
        {items ? (
          items.map((item: PokemonData) => (
            <StyledLink
              href={`/pokemon/${item.name}`}
              key={item.name}
              onClick={() => handleClick(item.url, item.image)}
            >
              <li key={item.url}>
                <p>{item.name}</p>
                {item.image ? (
                  <Image
                    src={`${item.image}` || ''}
                    alt={item.name}
                    width={100}
                    height={100}
                  />
                ) : (
                  <></>
                )}
              </li>
            </StyledLink>
          ))
        ) : (
          <p>ポケモンは見つかりませんでした</p>
        )}
      </Styled.MuiGridList>
    </>
  );
};

export default Component;
