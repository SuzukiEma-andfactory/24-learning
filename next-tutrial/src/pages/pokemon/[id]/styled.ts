import { Box, styled, Typography } from '@mui/material';

export const StyledContainer = styled(Box)(({}) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  margin: '40px',
  backgroundColor: '#8f8f8f17',
  gap: '8px',
  padding: '24px',
}));

export const LegendOrMythical = styled(Typography)<{
  isLegendary?: boolean;
  isMythical?: boolean;
}>(({ isLegendary, isMythical }) => ({
  color: isLegendary ? '#1e90ff' : isMythical ? '#8a2be2' : 'inherit',
}));
