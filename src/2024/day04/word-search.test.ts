import { WordSearch } from './word-search.js';

describe('WordSearch.countXmas()', () => {
  it.each([
    ['left to right', ['SSSSSS', 'SXMASS']],
    ['right to left', ['SSSSSS', 'SAMXSS']],
    ['top to bottom', ['SS', 'SX', 'SM', 'SA', 'SS', 'SS']],
    ['bottom to top', ['SS', 'SA', 'SM', 'SX', 'SS', 'SS']],
    ['top left to bottom right', ['SXSSSS', 'SSMSSS', 'SSSASS', 'SSSSSS']],
    ['bottom left to top right', ['SSSSSS', 'SSSASS', 'SSMSSS', 'SXSSSS']],
    ['top right to bottom left', ['SSSSXS', 'SSSMSS', 'SSASSS', 'SSSSSS']],
    ['bottom right to top left', ['SSSSSS', 'SSASSS', 'SSSMSS', 'SSSSXS']],
  ])('find XMAS %s', (_, lines) => {
    const wordSearch = new WordSearch(lines);
    expect(wordSearch.countXmas()).toBe(1);
  });

  it('handle example', () => {
    const wordSearch = new WordSearch([
      'MMMSXXMASM',
      'MSAMXMSMSA',
      'AMXSXMAAMM',
      'MSAMASMSMX',
      'XMASAMXAMM',
      'XXAMMXXAMA',
      'SMSMSASXSS',
      'SAXAMASAAA',
      'MAMMMXMMMM',
      'MXMXAXMASX',
    ]);
    expect(wordSearch.countXmas()).toBe(18);
  });
});

describe('WordSearch.countCrossMas()', () => {
  it('handle example', () => {
    const wordSearch = new WordSearch([
      'MMMSXXMASM',
      'MSAMXMSMSA',
      'AMXSXMAAMM',
      'MSAMASMSMX',
      'XMASAMXAMM',
      'XXAMMXXAMA',
      'SMSMSASXSS',
      'SAXAMASAAA',
      'MAMMMXMMMM',
      'MXMXAXMASX',
    ]);
    expect(wordSearch.countCrossMas()).toBe(9);
  });
});
