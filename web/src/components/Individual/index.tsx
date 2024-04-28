import { type FC } from 'react';
import {
  Box,
  Stack,
  type Theme,
  Typography,
  useMediaQuery,
  Alert,
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridCellParams,
} from '@mui/x-data-grid';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { type WasmInput, type User, type IndividualResult } from '../../types';
import { shortenContestName } from '../../utils/Data';
import { getColorClassName } from '../../utils/Rating';

type IndividualProps = {
  users: User[];
  userName: string;
  wasmInput: WasmInput;
};

const Individual: FC<IndividualProps> = (props) => {
  const { users, wasmInput, userName } = props;
  const user = users.find((user) => user.userScreenName === userName);
  const foundUser = user !== undefined;
  const rating = user?.rating ?? 0;
  const contests = wasmInput.contestResults.filter((result) => {
    const inPeriod =
      dayjs(wasmInput.since) <= dayjs(result.endTime) &&
      dayjs(result.endTime) <= dayjs(wasmInput.until);
    const targetTerm =
      (wasmInput.includeShort && !result.isLongTerm) ||
      (wasmInput.includeLong && result.isLongTerm);

    return inPeriod && targetTerm;
  });

  const contestResults = contests.flatMap((contest) =>
    contest.results
      .filter((result) => result.userScreenName === userName && result.isRated)
      .map((result) => ({
        ...result,
        contestName: shortenContestName(contest.contestName),
        endDate: dayjs(contest.endTime).format('YYYY/MM/DD'),
      })),
  );

  const columns: GridColDef[] = [
    { field: 'contestName', headerName: 'コンテスト', flex: 1 },
    { field: 'endDate', headerName: '終了日', width: 120 },
    { field: 'place', headerName: '順位', width: 80 },
    {
      field: 'performance',
      headerName: 'Performance',
      width: 100,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellClassName: (params: GridCellParams<any, string>) => {
        return params.value != null
          ? clsx(getColorClassName(Number(params.value)))
          : '';
      },
    },
  ];

  const getRowId = (result: IndividualResult & { contestName: string }) => {
    return result.contestName;
  };

  const showEndDate = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('sm'),
  );

  let responsiveTheme = createTheme();
  responsiveTheme = responsiveFontSizes(responsiveTheme);

  return (
    <Box>
      <Box
        sx={{ display: foundUser ? 'none' : 'block' }}
        py={2}
        textAlign="start"
      >
        <Alert severity="info">
          「順位」タブでユーザーを選択すると個人成績が表示されます。
        </Alert>
      </Box>
      <Stack spacing={1}>
        <ThemeProvider theme={responsiveTheme}>
          <Stack
            textAlign="left"
            p={1}
            spacing={1}
            sx={{ display: foundUser ? 'block' : 'none' }}
          >
            <Typography
              variant="h3"
              fontWeight={500}
              className={getColorClassName(rating)}
              noWrap
            >
              {user?.userScreenName ?? ''}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h5">Rating</Typography>
              <Typography
                variant="h4"
                fontWeight={700}
                className={getColorClassName(rating)}
              >
                {rating}
              </Typography>
            </Stack>
          </Stack>
        </ThemeProvider>
        <DataGrid
          rows={contestResults}
          columns={columns}
          getRowId={getRowId}
          autoHeight
          disableColumnMenu
          columnVisibilityModel={{ endDate: showEndDate }}
          pageSizeOptions={[20, 50, 100]}
        ></DataGrid>
      </Stack>
    </Box>
  );
};

export default Individual;
