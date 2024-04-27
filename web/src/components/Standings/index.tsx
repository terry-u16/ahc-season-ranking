import type { FC } from 'react';
import { Box } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridCellParams,
} from '@mui/x-data-grid';
import clsx from 'clsx';
import { type User } from '../../types';
import { getColorClassName } from '../../utils/Rating';

type StandingProps = {
  users: User[];
};

const Standings: FC<StandingProps> = (props) => {
  const { users } = props;

  const userColorDict = new Map<string, string>();

  for (const user of users) {
    userColorDict.set(user.userScreenName, getColorClassName(user.rating));
  }

  const columns: GridColDef[] = [
    { field: 'rank', headerName: '順位', width: 90, hideable: false },
    {
      field: 'userScreenName',
      headerName: 'ユーザー',
      flex: 1,
      hideable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellClassName: (params: GridCellParams<any, string>) => {
        return params.value != null
          ? clsx(userColorDict.get(params.value))
          : '';
      },
    },
    { field: 'rating', headerName: 'Rating', width: 100, hideable: false },
  ];

  const getRowId = (user: User) => {
    return user.userScreenName;
  };

  return (
    <>
      <Box>
        <DataGrid
          rows={users}
          columns={columns}
          getRowId={getRowId}
          pageSizeOptions={[20, 50, 100]}
          autoHeight
        ></DataGrid>
      </Box>
    </>
  );
};

export default Standings;
