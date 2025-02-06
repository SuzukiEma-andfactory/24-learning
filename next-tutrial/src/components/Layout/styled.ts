import { Box } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

export const LayoutBox = muiStyled(Box)(() => ({
  margin: '0 auto',
  maxWidth: '800px',
  padding: '40px 0',
}));
