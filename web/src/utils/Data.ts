import { type ContestResult } from '../types';

export const fetchContestResults = async (
  url: string,
): Promise<ContestResult[]> => {
  const response = await fetch(url);
  const data = (await response.json()) as ContestResult[];

  return data;
};
