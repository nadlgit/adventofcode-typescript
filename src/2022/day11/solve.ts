import { getInputLines } from '#utils/index.js';
import { GameManager, parseMonkeys } from './monkeys.js';

export function solvePart1(filepath: string) {
  const monkeys = parseMonkeys(getInputLines(filepath));
  const game = new GameManager(monkeys, 'part1');
  game.playRounds(20);
  return game.calcMonkeyBusinessLevel();
}

export function solvePart2(filepath: string) {
  const monkeys = parseMonkeys(getInputLines(filepath));
  const game = new GameManager(monkeys, 'part2');
  game.playRounds(10000);
  return game.calcMonkeyBusinessLevel();
}
