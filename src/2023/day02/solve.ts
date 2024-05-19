import { parseInputLines, sum } from '#utils/index.js';
import { type CubeSet, identifyGameMinCubeSet, isPossibleGame, parseGame } from './game.js';

export async function solvePart1(filepath: string, bag: CubeSet) {
  const games = await parseInputLines(filepath, parseGame);
  const possibleGames = games.filter((game) => isPossibleGame(game, bag));
  return sum(possibleGames.map(({ id }) => id));
}

export async function solvePart2(filepath: string) {
  const games = await parseInputLines(filepath, parseGame);
  const powers = games.map((game) => {
    const { red, green, blue } = identifyGameMinCubeSet(game);
    return red * green * blue;
  });
  return sum(powers);
}
