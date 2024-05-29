import { type FC } from 'react';
import { Stack, type Theme, useMediaQuery } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridCellParams,
  GridToolbarQuickFilter,
  type GridRowSelectionModel,
} from '@mui/x-data-grid';
import clsx from 'clsx';
import { type User } from '../../types';
import { getColorClassName } from '../../utils/Rating';

type StandingProps = {
  users: User[];
  onSelectionChange: (users: GridRowSelectionModel) => void;
};

function QuickSearchToolbar() {
  return (
    <Stack
      direction="row-reverse"
      sx={{
        p: 1,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter />
    </Stack>
  );
}

const Standings: FC<StandingProps> = (props) => {
  const { users } = props;

  const userColorDict = new Map<string, string>();

  for (const user of users) {
    userColorDict.set(user.userScreenName, getColorClassName(user.rating));
  }

  const columns: GridColDef[] = [
    {
      field: 'rank',
      headerName: '順位',
      width: 90,
      hideable: false,
      resizable: false,
    },
    {
      field: 'userScreenName',
      headerName: 'ユーザー',
      flex: 1,
      hideable: false,
      resizable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellClassName: (params: GridCellParams<any, string>) => {
        return params.value != null
          ? clsx(userColorDict.get(params.value))
          : '';
      },
    },
    {
      field: 'rating',
      headerName: 'Rating',
      width: 100,
      hideable: false,
      resizable: false,
    },
    {
      field: 'matchCount',
      headerName: '参加数',
      width: 100,
      hideable: false,
      resizable: false,
    },
    {
      field: 'winCount',
      headerName: '優勝数',
      width: 100,
      hideable: false,
      resizable: false,
    },
    {
      field: 'gp30',
      headerName: 'GP30',
      width: 100,
      hideable: false,
      resizable: false,
    },
  ];

  const getRowId = (user: User) => {
    return user.userScreenName;
  };

  const showDetail = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

  return (
    <DataGrid
      rows={users}
      columns={columns}
      getRowId={getRowId}
      pageSizeOptions={[20, 50, 100]}
      autoHeight
      disableColumnMenu
      slots={{ toolbar: QuickSearchToolbar }}
      onRowSelectionModelChange={props.onSelectionChange}
      columnVisibilityModel={{ matchCount: showDetail, winCount: showDetail }}
    ></DataGrid>
  );
};

export default Standings;
