import { getInputLines, multiply } from '#utils/index.js';
import { countWinningWays, parseRaces, parseUniqueRace } from './race.js';

export function solvePart1(filepath: string) {
  const races = parseRaces(getInputLines(filepath));
  const winningWays = races.map((race) => countWinningWays(race));
  return multiply(winningWays);
}

export function solvePart2(filepath: string) {
  const race = parseUniqueRace(getInputLines(filepath));
  return countWinningWays(race);
}
