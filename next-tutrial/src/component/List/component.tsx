import Image from 'next/image';
import * as Styled from './styled';

const Component = ({ items }: any) => {
  return (
    <>
      <Styled.MuiGridList columns={3}>
        {items ? (
          items.map((item: any) => (
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
          ))
        ) : (
          <p>ポケモンは見つかりませんでした</p>
        )}
      </Styled.MuiGridList>
    </>
  );
};

export default Component;
