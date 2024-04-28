import type { FC } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import { type Dayjs } from 'dayjs';
import { type PeriodSetting } from '../../types';
import PeriodSelect from './PeriodSelect';
import YearSelect from './YearSelect';

type SettingPanelProps = {
  period: PeriodSetting;
  onPeriodChange: (period: PeriodSetting) => void;
};

const SettingPanel: FC<SettingPanelProps> = (props) => {
  const { period } = props;

  const onPeriodSelectionChange = (selected: string) => {
    props.onPeriodChange({
      ...period,
      selected,
    });
  };

  const onYearChange = (year: string) => {
    props.onPeriodChange({
      ...period,
      year,
    });
  };

  const onPeriodSinceChange = (since: Dayjs) => {
    props.onPeriodChange({
      ...period,
      since,
    });
  };

  const onPeriodUntilChange = (until: Dayjs) => {
    props.onPeriodChange({
      ...period,
      until,
    });
  };

  const onShortChange = (short: boolean) => {
    props.onPeriodChange({
      ...period,
      short,
    });
  };

  const onLongChange = (long: boolean) => {
    props.onPeriodChange({
      ...period,
      long,
    });
  };

  return (
    <Paper variant="outlined">
      <Box textAlign="start">
        <Stack m={2}>
          <Box p={1}>
            <Typography variant="h4">集計条件</Typography>
          </Box>
          <FormControl>
            <FormLabel id="period-settngs-group-label"></FormLabel>
            <RadioGroup
              aria-labelledby="period-settngs-group-label"
              name="period-settings-group"
              defaultValue={period.selected}
              onChange={(event) => {
                onPeriodSelectionChange(event.target.value);
              }}
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="全期間"
                sx={{ margin: '8px 0' }}
              />
              <FormControlLabel
                value="year"
                control={<Radio />}
                label={
                  <YearSelect
                    year={period.year}
                    disabled={period.selected !== 'year'}
                    onYearChange={onYearChange}
                  />
                }
                sx={{ margin: '8px 0' }}
              />
              <FormControlLabel
                value="period"
                control={<Radio />}
                label={
                  <PeriodSelect
                    since={period.since}
                    until={period.until}
                    disabled={period.selected !== 'period'}
                    onPeriodSinceChange={onPeriodSinceChange}
                    onPeriodUntilChange={onPeriodUntilChange}
                  />
                }
                sx={{ margin: '8px 0' }}
              />
            </RadioGroup>
            <FormGroup>
              <Stack direction="row" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={props.period.short}
                      onChange={(event) => {
                        onShortChange(event.target.checked);
                      }}
                    />
                  }
                  label="短期"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={props.period.long}
                      onChange={(event) => {
                        onLongChange(event.target.checked);
                      }}
                    />
                  }
                  label="長期"
                />
              </Stack>
            </FormGroup>
          </FormControl>
        </Stack>
      </Box>
    </Paper>
  );
};

export default SettingPanel;
