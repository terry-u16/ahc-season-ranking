import type { FC } from 'react';
import { QueryStats } from '@mui/icons-material';
import { Typography, AppBar, Toolbar } from '@mui/material';

const ApplicationBar: FC = () => {
  return (
    <AppBar>
      <Toolbar variant="dense">
        <QueryStats sx={{ mr: 2 }} />
        <Typography variant="h5" noWrap>
          AtCoder Heuristic Season Ranking
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;
