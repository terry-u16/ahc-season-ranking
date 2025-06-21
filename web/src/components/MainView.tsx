import type { FC } from 'react';
import { useState } from 'react';
import { Alert, Box, Container, Paper, Stack } from '@mui/material';
import dayjs from 'dayjs';
import useSWR from 'swr';
import { calc_ratings } from '../../public/wasm/wasm';
import { type WasmInput, type ContestResult, type WasmOutput } from '../types';
import { fetchContestResults } from '../utils/Data';
import { toDuration } from '../utils/Date';
import MainTab from './MainTab';
import SettingPanel from './SettingPanel';

const MainView: FC = () => {
  const { data: contestResults } = useSWR<ContestResult[]>(
    '/contest_results.json',
    fetchContestResults,
  );
  const [period, setPeriod] = useState({
    selected: 'year',
    year: '2025',
    since: dayjs('2025-01-01'),
    until: dayjs('2025-12-31'),
    short: true,
    long: true,
  });

  const { since, until } = toDuration(period);

  const input: WasmInput = {
    contestResults: contestResults ?? [],
    since,
    until,
    includeShort: period.short,
    includeLong: period.long,
  };

  const output = calc_ratings(input) as WasmOutput;

  const onPeriodChange = (newPeriod: typeof period) => {
    setPeriod(newPeriod);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={4}>
        <Box p={3}>
          <Stack spacing={2}>
            <Alert severity="warning">
              2025年から適用されたAHC新レーティングシステム・GP30には未対応です。ご了承ください。
            </Alert>
            <SettingPanel
              period={period}
              onPeriodChange={onPeriodChange}
            ></SettingPanel>
            <MainTab
              users={output.users}
              wasmInput={input}
              period={period}
            ></MainTab>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default MainView;
