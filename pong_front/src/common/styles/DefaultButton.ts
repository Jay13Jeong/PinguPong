import { styled, Button } from '@mui/material/';

export const DefaultButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
    margin: '1rem',
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
    },
    a : {
        textDecoration: 'none',
        color: 'inherit',
    }
  }));