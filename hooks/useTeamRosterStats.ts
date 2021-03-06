import useSWR from 'swr';
import { Player, Goalie } from '../';
import { getQuerySeason } from '../utils/season';

const useStandings = (
  league: string,
  team: number
): {
  roster: Array<Player | Goalie>;
  isLoading: boolean;
  isError: boolean;
} => {
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);
  const season = getQuerySeason();
  const seasonParam = season ? `&season=${season}` : '';

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/teams/${team}/roster/stats?league=${leagueid}${seasonParam}`
  );

  return {
    roster: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useStandings;
