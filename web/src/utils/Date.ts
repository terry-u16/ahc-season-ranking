import dayjs from 'dayjs';
import { type PeriodSetting } from '../types';

export const toDuration = (
  periodSetting: PeriodSetting,
): { since: string; until: string } => {
  switch (periodSetting.selected) {
    case 'all':
      return {
        since: dayjs('0001-01-01T00:00:00').format(),
        until: dayjs('9999-01-01T00:00:00').format(),
      };
    case 'year':
      return {
        since: dayjs(`${periodSetting.year}-01-01T00:00:00`).format(),
        until: dayjs(
          `${Number(periodSetting.year) + 1}-01-01T00:00:00`,
        ).format(),
      };
    case 'period':
      return {
        since: periodSetting.since.format(),
        until: periodSetting.until.add(1, 'day').format(),
      };
    default:
      throw new Error('Invalid period setting.');
  }
};
