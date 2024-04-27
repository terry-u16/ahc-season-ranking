import { type ContestResult } from '../types';

export const fetchContestResults = async (
  url: string,
): Promise<ContestResult[]> => {
  const response = await fetch(url);
  const data = (await response.json()) as ContestResult[];

  return data;
};

export const shortenContestName = (contestName: string): string => {
  const regexp = /AtCoder Heuristic Contest (\d{3})/g;
  const matches = regexp.exec(contestName);

  if (matches === null) {
    return contestName;
  } else {
    return `AHC${matches[1]}`;
  }
};
