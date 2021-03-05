import useSWR from 'swr';
import { useRouter } from 'next/router';

const useStandings = (
  league: string,
  display = 'league'
): {
  standings:
    | {
        position: number;
        id: number;
        name: string;
        location: string;
        abbreviation: string;
        gp: number;
        wins: number;
        losses: number;
        OTL: number;
        points: number;
        winPercent: string;
        ROW: number;
        goalsFor: number;
        goalsAgainst: number;
        goalDiff: number;
        home: {
          wins: number;
          losses: number;
          OTL: number;
        };
        away: {
          wins: number;
          losses: number;
          OTL: number;
        };
        shootout: {
          wins: number;
          losses: number;
        };
      }
    | Array<{
        name: string;
        teams: {
          position: number;
          id: number;
          name: string;
          location: string;
          abbreviation: string;
          gp: number;
          wins: number;
          losses: number;
          OTL: number;
          points: number;
          winPercent: string;
          ROW: number;
          goalsFor: number;
          goalsAgainst: number;
          goalDiff: number;
          home: {
            wins: number;
            losses: number;
            OTL: number;
          };
          away: {
            wins: number;
            losses: number;
            OTL: number;
          };
          shootout: {
            wins: number;
            losses: number;
          };
        };
      }>;
  isLoading: boolean;
  isError: boolean;
} => {
  const router = useRouter();
  const { query: { season } } = router;
  const leagueid = ['shl', 'smjhl', 'iihf', 'wjc'].indexOf(league);

  const { data, error } = useSWR(
    () =>
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/standings?league=${leagueid}&display=${display}&season=${season}`
  );

  return {
    standings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useStandings;
