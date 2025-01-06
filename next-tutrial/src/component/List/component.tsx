import Image from 'next/image';

const Component = ({ items }: any) => {
  return (
    <>
      <ul>
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
      </ul>
    </>
  );
};

export default Component;
