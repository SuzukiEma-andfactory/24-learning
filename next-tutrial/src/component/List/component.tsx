import { useEffect } from 'react';

const Component = ({ items }: any) => {
  useEffect(() => {
    console.log('Items in List:', items); // デバッグ用
  }, [items]);

  return (
    <>
      <ul>
        {items && items.length > 0 ? ( // itemsが存在し、配列として要素を持つ場合
          items.map((item: any) => (
            <li key={item.name}>
              <p>{item.name}</p>
              {/* <Image src={item.url} alt={item.name} width={100} height={100} /> */}
            </li>
          ))
        ) : (
          <div>No Pokemon found</div>
        )}
      </ul>
    </>
  );
};

export default Component;
