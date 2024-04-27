import { type FC } from 'react';
import './App.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
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
        <InitWasm />
      </ThemeProvider>
    </>
  );
};

export default App;
