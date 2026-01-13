import type { FC } from 'react';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';

type YearSelectProps = {
  year: string;
  disabled: boolean;
  onYearChange: (year: string) => void;
};

const YearSelect: FC<YearSelectProps> = (props) => {
  const { year, disabled } = props;

  const onChange = (event: SelectChangeEvent<string>) => {
    props.onYearChange(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="period-settings-year-select-label"></FormLabel>
      <Select
        labelId="period-settings-year-select-label"
        id="period-settings-year-select"
        value={year}
        disabled={disabled}
        onChange={onChange}
      >
        <MenuItem value="2021">2021年</MenuItem>
        <MenuItem value="2022">2022年</MenuItem>
        <MenuItem value="2023">2023年</MenuItem>
        <MenuItem value="2024">2024年</MenuItem>
        <MenuItem value="2025">2025年</MenuItem>
        <MenuItem value="2026">2026年</MenuItem>
      </Select>
    </FormControl>
  );
};

export default YearSelect;
