import { PokemonData } from '@/pages/hooks/rest/usePokemonIndex';
import Image from 'next/image';
import Link from 'next/link';
import { styled } from 'styled-components';
import * as Styled from './styled';

const StyledLink = styled(Link)`
  width: 100%;
`;

const Component = ({ items }: { items: PokemonData[] }) => {
  return (
    <>
      <Styled.MuiGridList columns={3}>
        {items ? (
          items.map((item: PokemonData) => (
            <StyledLink href={`/pokemon/${item.name}`} key={item.name}>
              <li key={item.name}>
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
