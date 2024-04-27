import type { FC } from 'react';
import { Stack } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { type Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ja';

type PeriodSelectProps = {
  since: Dayjs;
  until: Dayjs;
  disabled: boolean;
  onPeriodSinceChange: (since: Dayjs) => void;
  onPeriodUntilChange: (until: Dayjs) => void;
};

class DateAdapter extends AdapterDayjs {
  getWeekdays = (): string[] => ['日', '月', '火', '水', '木', '金', '土'];
}

const PeriodSelect: FC<PeriodSelectProps> = (props) => {
  const { since, until, disabled } = props;

  return (
    <Stack direction="row">
      <LocalizationProvider dateAdapter={DateAdapter} adapterLocale="ja">
        <DatePicker
          label="開始"
          value={since}
          maxDate={until}
          format="YYYY/MM/DD"
          disabled={disabled}
          onChange={(date) => {
            if (date === null) return;
            props.onPeriodSinceChange(date);
          }}
        />
        <DatePicker
          label="終了"
          value={until}
          minDate={since}
          format="YYYY/MM/DD"
          disabled={disabled}
          onChange={(date) => {
            if (date === null) return;
            props.onPeriodUntilChange(date);
          }}
        />
      </LocalizationProvider>
    </Stack>
  );
};

export default PeriodSelect;
