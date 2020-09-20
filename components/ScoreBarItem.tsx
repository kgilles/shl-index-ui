/* eslint-disable no-nested-ternary */
import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

function ScoreBarItem({
  data,
  gameid = '',
  isDate = false,
  league,
  HomeIcon,
  AwayIcon,
}) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // eslint-disable-next-line camelcase
  const teams_short = [
    'BUF',
    'CHI',
    'HAM',
    'TOR',
    'MAN',
    'NEW',
    'TBB',
    'BAL',
    'CAL',
    'EDM',
    'MIN',
    'WPG',
    'SFP',
    'LAP',
    'NOLA',
    'TEX',
  ];

  const winner = data.homeScore > data.awayScore;

  return (
    <>
      {isDate ? (
        <Date role="presentation" aria-label="Score Bar Date">
          <span aria-label="Date">
            {months[+gameid.substr(0, 2) - 1]} {gameid.substr(2, 2)}
          </span>
        </Date>
      ) : (
        <Link
          href="/[league]/[season]/game/[gameid]"
          as={`/${league}/${data.season}/game/${gameid}`}
          passHref
        >
          <Game role="link" aria-label="Game Result" tabIndex={0}>
            <TeamLine winner={winner}>
              <TeamIcon>
                <HomeIcon aria-label={teams_short[+gameid.substr(5, 2)]} />
              </TeamIcon>
              <span className="sbi-shortname" aria-label="Home Team">
                {teams_short[+gameid.substr(5, 2)]}
              </span>
              <span className="sbi-score" aria-label="Home Score">
                {data.homeScore}
              </span>
            </TeamLine>
            <TeamLine winner={!winner}>
              <TeamIcon>
                <AwayIcon aria-label={teams_short[+gameid.substr(7, 2)]} />
              </TeamIcon>
              <span className="sbi-shortname" aria-label="Away Team">
                {teams_short[+gameid.substr(7, 2)]}
              </span>
              <span className="sbi-score" aria-label="Away Score">
                {data.awayScore}
              </span>
            </TeamLine>
            <GameResultText aria-label="Game Result">
              FINAL{data.shootout ? '/SO' : data.ot ? '/OT' : ''}
            </GameResultText>
          </Game>
        </Link>
      )}
    </>
  );
}

// ScoreBarItem.propTypes = {
//   data: PropTypes.shape({
//     season: PropTypes.string.isRequired,
//     homeScore: PropTypes.number,
//     awayScore: PropTypes.number,
//     ot: PropTypes.number,
//     shootout: PropTypes.number,
//   }).isRequired,
//   gameid: PropTypes.string,
//   isDate: PropTypes.bool,
//   league: PropTypes.string.isRequired,
//   HomeIcon: PropTypes.element,
//   AwayIcon: PropTypes.element,
// };

const Date = styled.div`
  width: 46px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid ${({ theme }) => theme.colors.grey500};
  background-color: ${({ theme }) => theme.colors.grey200};
  position: relative;

  & span {
    color: ${({ theme }) => theme.colors.grey900};
    font-weight: 700;
    text-align: center;
    line-height: 1.4;
    font-size: 16px;
    width: 3ch;
    position: relative;
    top: 3px;
  }
`;

const Game = styled.div`
  width: 189px;
  height: 100%;
  padding-top: 23px;
  border-right: 1px solid ${({ theme }) => theme.colors.grey500};
  background-color: ${({ theme }) => theme.colors.grey100};
  position: relative;

  &:hover ::after {
    cursor: pointer;
    content: 'See Game Results';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.85;

    background-color: ${({ theme }) => theme.colors.grey900};
    color: ${({ theme }) => theme.colors.grey100};
  }
`;

const TeamLine = styled.div<{ winner: boolean }>`
  width: 80%;
  margin: 5px auto;
  display: grid;
  grid-template-columns: 12% 65px 1fr;
  color: ${({ winner, theme }) =>
    winner ? theme.colors.grey900 : theme.colors.grey650};
  & .sbi-shortname {
    font-weight: 700;
    margin-left: 10px;
    font-size: 0.9rem;
    display: inline-block;
  }

  & .sbi-score {
    font-size: 0.9rem;
    font-weight: 700;
    display: inline-block;
  }
`;

const TeamIcon = styled.div`
  width: 100%;
  display: inline-block;
`;

const GameResultText = styled.span`
  display: inline-block;
  position: absolute;
  left: 121px;
  width: 60px;
  text-align: center;
  top: 43px;
  font-size: 0.8rem;
`;

export default React.memo(ScoreBarItem);