import type { FC } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
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

  return (
    <>
      <FormControl>
        <FormLabel id="period-settngs-group-label"></FormLabel>
        <RadioGroup
          aria-labelledby="period-settngs-group-label"
          name="period-settings-group"
          defaultValue="all"
          onChange={(event) => {
            onPeriodSelectionChange(event.target.value);
          }}
        >
          <FormControlLabel value="all" control={<Radio />} label="全期間" />
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
          />
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default SettingPanel;
