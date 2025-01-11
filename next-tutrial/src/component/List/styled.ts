import { styled as muiStyled } from '@mui/material/styles';

type GridColumnProps = {
  columns: number;
};

export const MuiGridList = muiStyled('ul')<GridColumnProps>(({ columns }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  justifyItems: 'center',
  textAlign: 'center',
  gap: '16px',
  listStyle: 'none',
  margin: '0 auto',
  maxWidth: '800px',

  '& li': {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#8f8f8f17',
    alignItems: 'center',
  },
}));
