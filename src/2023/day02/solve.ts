import { getInputLines, sum } from '#utils/index.js';
import { type CubeSet, identifyGameMinCubeSet, isPossibleGame, parseGame } from './game.js';

export function solvePart1(filepath: string, bag: CubeSet) {
  const games = getInputLines(filepath).map((line) => parseGame(line));
  const possibleGames = games.filter((game) => isPossibleGame(game, bag));
  return sum(possibleGames.map(({ id }) => id));
}

export function solvePart2(filepath: string) {
  const games = getInputLines(filepath).map((line) => parseGame(line));
  const powers = games.map((game) => {
    const { red, green, blue } = identifyGameMinCubeSet(game);
    return red * green * blue;
  });
  return sum(powers);
}
