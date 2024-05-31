import { type Dayjs } from 'dayjs';

export type MainViewState = {
  contestResults: ContestResult[];
  periodSetting: PeriodSetting;
};

export type WasmInput = {
  contestResults: ContestResult[];
  since: string;
  until: string;
  includeShort: boolean;
  includeLong: boolean;
};

export type ContestResult = {
  contestName: string;
  isLongTerm: boolean;
  endTime: string;
  results: IndividualResult[];
};

export type IndividualResult = {
  isRated: boolean;
  place: number;
  performance: number;
  userScreenName: string;
};

export type WasmOutput = {
  users: User[];
  error: string;
};

export type User = {
  rating: number;
  rank: number;
  matchCount: number;
  winCount: number;
  gp30: number;
  userScreenName: string;
};

export type PeriodSetting = {
  selected: string;
  year: string;
  since: Dayjs;
  until: Dayjs;
  short: boolean;
  long: boolean;
};
