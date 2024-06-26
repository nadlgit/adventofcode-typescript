import { Platform } from './platform.js';

describe('Platform.toStringLines()', () => {
  it('handles example', () => {
    const lines: string[] = [
      'O....#....',
      'O.OO#....#',
      '.....##...',
      'OO.#O....O',
      '.O.....O#.',
      'O.#..O.#.#',
      '..O..#O..O',
      '.......O..',
      '#....###..',
      '#OO..#....',
    ];
    const platform = new Platform(lines);
    expect(platform.toStringLines()).toEqual(lines);
  });
});

describe('Platform.tiltNorth()', () => {
  it('handles example', () => {
    const platform = new Platform([
      'O....#....',
      'O.OO#....#',
      '.....##...',
      'OO.#O....O',
      '.O.....O#.',
      'O.#..O.#.#',
      '..O..#O..O',
      '.......O..',
      '#....###..',
      '#OO..#....',
    ]);
    platform.tiltNorth();
    expect(platform.toStringLines()).toEqual([
      'OOOO.#.O..',
      'OO..#....#',
      'OO..O##..O',
      'O..#.OO...',
      '........#.',
      '..#....#.#',
      '..O..#.O.O',
      '..O.......',
      '#....###..',
      '#....#....',
    ]);
  });
});

describe('Platform.getNorthBeamsLoad()', () => {
  it('handles example', () => {
    const platform = new Platform([
      'OOOO.#.O..',
      'OO..#....#',
      'OO..O##..O',
      'O..#.OO...',
      '........#.',
      '..#....#.#',
      '..O..#.O.O',
      '..O.......',
      '#....###..',
      '#....#....',
    ]);
    expect(platform.getNorthBeamsLoad()).toBe(136);
  });
});

describe('Platform.tiltCycle()', () => {
  it('handles example cycle 1', () => {
    const platform = new Platform([
      'O....#....',
      'O.OO#....#',
      '.....##...',
      'OO.#O....O',
      '.O.....O#.',
      'O.#..O.#.#',
      '..O..#O..O',
      '.......O..',
      '#....###..',
      '#OO..#....',
    ]);
    platform.tiltCycle();
    expect(platform.toStringLines()).toEqual([
      '.....#....',
      '....#...O#',
      '...OO##...',
      '.OO#......',
      '.....OOO#.',
      '.O#...O#.#',
      '....O#....',
      '......OOOO',
      '#...O###..',
      '#..OO#....',
    ]);
  });

  it('handles example cycle 2', () => {
    const platform = new Platform([
      '.....#....',
      '....#...O#',
      '...OO##...',
      '.OO#......',
      '.....OOO#.',
      '.O#...O#.#',
      '....O#....',
      '......OOOO',
      '#...O###..',
      '#..OO#....',
    ]);
    platform.tiltCycle();
    expect(platform.toStringLines()).toEqual([
      '.....#....',
      '....#...O#',
      '.....##...',
      '..O#......',
      '.....OOO#.',
      '.O#...O#.#',
      '....O#...O',
      '.......OOO',
      '#..OO###..',
      '#.OOO#...O',
    ]);
  });

  it('handles example cycle 3', () => {
    const platform = new Platform([
      '.....#....',
      '....#...O#',
      '.....##...',
      '..O#......',
      '.....OOO#.',
      '.O#...O#.#',
      '....O#...O',
      '.......OOO',
      '#..OO###..',
      '#.OOO#...O',
    ]);
    platform.tiltCycle();
    expect(platform.toStringLines()).toEqual([
      '.....#....',
      '....#...O#',
      '.....##...',
      '..O#......',
      '.....OOO#.',
      '.O#...O#.#',
      '....O#...O',
      '.......OOO',
      '#...O###.O',
      '#.OOO#...O',
    ]);
  });
});
