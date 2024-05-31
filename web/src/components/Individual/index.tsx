import { type FC } from 'react';
import { Share } from '@mui/icons-material';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  type GridCellParams,
} from '@mui/x-data-grid';
import clsx from 'clsx';
import dayjs from 'dayjs';
import ordinal from 'ordinal';
import { calc_gp30_score } from '../../../public/wasm/wasm';
import {
  type WasmInput,
  type User,
  type IndividualResult,
  type PeriodSetting,
} from '../../types';
import { shortenContestName } from '../../utils/Data';
import {
  getColorClassName,
  convertPerformanceFromInner,
} from '../../utils/Rating';

type IndividualProps = {
  users: User[];
  userName: string;
  period: PeriodSetting;
  wasmInput: WasmInput;
};

const Individual: FC<IndividualProps> = (props) => {
  const { users, wasmInput, userName, period } = props;
  const user = users.find((user) => user.userScreenName === userName);
  const foundUser = user !== undefined;
  const rating = user?.rating ?? 0;
  const matchCount = user?.matchCount ?? 0;
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
        performance: convertPerformanceFromInner(result.performance),
        contestName: shortenContestName(contest.contestName),
        endDate: dayjs(contest.endTime).format('YYYY/MM/DD'),
        gp30: calc_gp30_score(result.place),
      })),
  );

  const columns: GridColDef[] = [
    {
      field: 'contestName',
      headerName: 'コンテスト',
      flex: 1,
      resizable: false,
    },
    { field: 'endDate', headerName: '終了日', width: 120, resizable: false },
    { field: 'place', headerName: '順位', width: 80, resizable: false },
    {
      field: 'performance',
      headerName: 'Performance',
      width: 100,
      resizable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellClassName: (params: GridCellParams<any, string>) => {
        return params.value != null
          ? clsx(getColorClassName(Number(params.value)))
          : '';
      },
    },
    { field: 'gp30', headerName: 'GP30', width: 80, resizable: false },
  ];

  const getRowId = (result: IndividualResult & { contestName: string }) => {
    return result.contestName;
  };

  const onShareButtonClick = () => {
    let text = '[AtCoder Heuristic Season Ranking]\n';
    text += `${user?.userScreenName}\n`;

    const rank = user?.rank !== undefined ? ordinal(user.rank) : 'Unranked';
    const rating = user?.rating ?? 0;
    const gp30 = user?.gp30 ?? 0;
    text += `Season Ranking: ${rank}\n`;
    text += `Season Rating: ${rating}\n`;
    text += `Season GP30: ${gp30}\n\n`;

    switch (period.selected) {
      case 'all':
        text += 'Entire Period\n';
        break;
      case 'year':
        text += `${period.year} season\n`;
        break;
      case 'period':
        text += `${period.since.format('YYYY/MM/DD')} - ${period.until.format('YYYY/MM/DD')}\n`;
        break;
    }

    text += `${period.short ? '☑' : '☐'} Short term contests\n`;
    text += `${period.long ? '☑' : '☐'} Long term contests\n`;
    text += 'https://ahc-season-ranking.terry-u16.net/';
    const tag = 'AtCoderHeuristicSeasonRanking';
    const link =
      'https://twitter.com/intent/tweet?hashtags=' +
      tag +
      '&text=' +
      encodeURIComponent(text);
    window.open(link, '_blank', 'noreferrer');
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
              <a
                href={`https://atcoder.jp/users/${user?.userScreenName ?? ''}?contestType=heuristic`}
                target="_blank"
                rel="noopener noreferrer"
                className="no-link-style"
              >
                {user?.userScreenName ?? ''}
              </a>
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
              <Tooltip title="Share on X">
                <IconButton onClick={onShareButtonClick}>
                  <Share />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="baseline">
              <Typography variant="h6">コンテスト参加数</Typography>
              <Typography variant="h5">{matchCount}</Typography>
              <Typography variant="h6">回</Typography>
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
