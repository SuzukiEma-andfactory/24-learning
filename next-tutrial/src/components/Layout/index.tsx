import { ReactNode } from 'react';
import Component from './component';

export type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  return <Component {...props} />;
};

export default Layout;
