import { createTheme } from '@mui/material';
import { indigo, purple, pink } from '@mui/material/colors';

export const theme = createTheme({
  palette: {
    primary: {
      main: purple[900],
    },
    secondary: {
      main: pink[700],
    },
  },
});
