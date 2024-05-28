import {
  calcFixedPatternSummary,
  calcPatternSummary,
  calcReflectionSummary,
  countLineReflectionColsLeft,
  findPatternReflections,
  parsePatterns,
} from './reflections.js';

describe('parsePatterns()', () => {
  it('handles example', () => {
    expect(
      parsePatterns([
        '#.##..##.',
        '..#.##.#.',
        '##......#',
        '##......#',
        '..#.##.#.',
        '..##..##.',
        '#.#.##.#.',
        '',
        '#...##..#',
        '#....#..#',
        '..##..###',
        '#####.##.',
        '#####.##.',
        '..##..###',
        '#....#..#',
      ])
    ).toEqual([
      ['#.##..##.', '..#.##.#.', '##......#', '##......#', '..#.##.#.', '..##..##.', '#.#.##.#.'],
      ['#...##..#', '#....#..#', '..##..###', '#####.##.', '#####.##.', '..##..###', '#....#..#'],
    ]);
  });
});

describe('countLineReflectionColsLeft()', () => {
  it.each([
    { line: '', expected: new Set([]) },
    { line: '.##.', expected: new Set([2]) },
    { line: '.##.#', expected: new Set([2]) },
    { line: '#.##.', expected: new Set([3]) },
    { line: '.##..#', expected: new Set([2, 4]) },
    { line: '#.##.#', expected: new Set([3]) },
    { line: '#.##..##.', expected: new Set([5, 7]) },
  ])('$line -> $expected', ({ line, expected }) => {
    expect(countLineReflectionColsLeft(line)).toEqual(expected);
  });
});

describe('findPatternReflections()', () => {
  it('handles example pattern 1', () => {
    expect(
      findPatternReflections([
        '#.##..##.',
        '..#.##.#.',
        '##......#',
        '##......#',
        '..#.##.#.',
        '..##..##.',
        '#.#.##.#.',
      ])
    ).toIncludeSameMembers([{ type: 'vertical', value: 5 }]);
  });

  it('handles example pattern 2', () => {
    expect(
      findPatternReflections([
        '#...##..#',
        '#....#..#',
        '..##..###',
        '#####.##.',
        '#####.##.',
        '..##..###',
        '#....#..#',
      ])
    ).toIncludeSameMembers([{ type: 'horizontal', value: 4 }]);
  });

  it('handles smudge fixed example pattern 1', () => {
    expect(
      findPatternReflections([
        '..##..##.',
        '..#.##.#.',
        '##......#',
        '##......#',
        '..#.##.#.',
        '..##..##.',
        '#.#.##.#.',
      ])
    ).toIncludeSameMembers([
      { type: 'vertical', value: 5 },
      { type: 'horizontal', value: 3 },
    ]);
  });

  it('handles smudge fixed example pattern 2', () => {
    expect(
      findPatternReflections([
        '#...##..#',
        '#...##..#',
        '..##..###',
        '#####.##.',
        '#####.##.',
        '..##..###',
        '#....#..#',
      ])
    ).toIncludeSameMembers([{ type: 'horizontal', value: 1 }]);
  });
});

describe('calcReflectionSummary()', () => {
  it('handles vertical reflection', () => {
    expect(calcReflectionSummary({ type: 'vertical', value: 5 })).toBe(5);
  });

  it('handles horizontal reflection', () => {
    expect(calcReflectionSummary({ type: 'horizontal', value: 4 })).toBe(400);
  });
});

describe('calcPatternSummary()', () => {
  it('handles example pattern 1', () => {
    expect(
      calcPatternSummary([
        '#.##..##.',
        '..#.##.#.',
        '##......#',
        '##......#',
        '..#.##.#.',
        '..##..##.',
        '#.#.##.#.',
      ])
    ).toBe(5);
  });

  it('handles example pattern 2', () => {
    expect(
      calcPatternSummary([
        '#...##..#',
        '#....#..#',
        '..##..###',
        '#####.##.',
        '#####.##.',
        '..##..###',
        '#....#..#',
      ])
    ).toBe(400);
  });
});

describe('calcFixedPatternSummary()', () => {
  it('handles example pattern 1', () => {
    expect(
      calcFixedPatternSummary([
        '#.##..##.',
        '..#.##.#.',
        '##......#',
        '##......#',
        '..#.##.#.',
        '..##..##.',
        '#.#.##.#.',
      ])
    ).toBe(300);
  });

  it('handles example pattern 2', () => {
    expect(
      calcFixedPatternSummary([
        '#...##..#',
        '#....#..#',
        '..##..###',
        '#####.##.',
        '#####.##.',
        '..##..###',
        '#....#..#',
      ])
    ).toBe(100);
  });
});
