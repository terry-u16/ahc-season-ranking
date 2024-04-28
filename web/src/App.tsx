import { type FC } from 'react';
import './App.css';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  createTheme,
} from '@mui/material';
import ApplicationBar from './components/ApplicationBar';
import InitWasm from './components/InitWasm';

const App: FC = () => {
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Roboto',
        '"Noto Sans JP"',
        '"Helvetica"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApplicationBar />
        <Box>
          <Toolbar variant="dense" />
          <InitWasm />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default App;
