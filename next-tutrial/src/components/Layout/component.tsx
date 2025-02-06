import { Props } from '.';
import * as Styled from './styled';

const Component = ({ children }: Props) => {
  return (
    <>
      <Styled.LayoutBox>
        <div>{children}</div>
      </Styled.LayoutBox>
    </>
  );
};

export default Component;
