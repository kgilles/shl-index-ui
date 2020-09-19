import SQL from 'sql-template-strings';
import { query } from '../../../../lib/db';

export default async (req, res) => {
  const league = parseInt(req.query.league, 10) || 0;
  const days = parseInt(req.query.days, 10) || 5; // give 5 days of data by default.

  const [season] = await query(SQL`
      SELECT DISTINCT SeasonID
      FROM slugviewer
      WHERE LeagueID=${league}
      ORDER BY SeasonID DESC
      LIMIT 1
    `);

  const schedule = await query(SQL`
    SELECT s.Slug, s.Date, t1.Abbr as 'Home', s.HomeScore, t2.Abbr as 'Away', s.AwayScore, s.Overtime, s.Shootout
    FROM slugviewer as s
    INNER JOIN team_data AS t1 
      ON t1.TeamID = s.Home 
        AND t1.LeagueID = s.LeagueID 
        AND t1.SeasonID = s.SeasonID
    INNER JOIN team_data AS t2 
      ON t2.TeamID = s.Away 
        AND t2.LeagueID = s.LeagueID 
        AND t2.SeasonID = s.SeasonID
    WHERE s.LeagueID=${league}
      AND s.SeasonID=${season.SeasonID}
  `);

  // Clean up response
  const parsed = schedule.map((game) => ({
    slug: game.Slug,
    date: game.Date,
    homeTeam: game.Home,
    homeScore: game.HomeScore,
    awayTeam: game.Away,
    awayScore: game.AwayScore,
    overtime: game.Overtime,
    shootout: game.Shootout,
  }));

  // Simulate a GROUP BY Date
  const hash = parsed.reduce((persist, game) => {
    if (!persist[game.date]) {
      return {
        [game.date]: [game],
        ...persist,
      };
    }

    return {
      [game.date]: persist[game.date].push(game),
      ...persist,
    };
  }, {});

  const dateList = Object.keys(hash).map((date) => ({
    date,
    played: 1, // hash[date][0].played  // can assume that if one game has been played all have been for said day.
    games: hash[date],
  }));

  dateList.sort((a, b) => new Date(a.date) - new Date(b.date));

  // get x amount of played game days and 1 game from the future.
  const playedGames = dateList.filter(({ played }) => played);
  const nextGameDay = dateList
    .filter(({ played }) => !played)
    .slice(playedGames.length < days ? days - playedGames.length : 1);

  const lastGames = playedGames.slice(
    Math.max(
      playedGames.length - days < 0
        ? playedGames.length
        : playedGames.length - days - nextGameDay.length,
      1
    )
  );

  res.status(200).json([...lastGames, ...nextGameDay]);
};