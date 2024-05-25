import {
  countDamagedArrangements,
  countRecordArrangements,
  countUnfoldRecordArrangements,
  parseRecord,
  unfoldRecord,
} from './spring.js';

describe('parseRecord()', () => {
  it('handles example', () => {
    expect(parseRecord('?###???????? 3,2,1')).toEqual({
      springs: '?###????????',
      damagedGroups: [3, 2, 1],
    });
  });
});

describe('countDamagedArrangements()', () => {
  it.each([
    { springs: '', damagedGroups: [], expected: 1 },
    { springs: '', damagedGroups: [1], expected: 0 },
    { springs: '.', damagedGroups: [], expected: 1 },
    { springs: '.', damagedGroups: [1], expected: 0 },
    { springs: '#', damagedGroups: [], expected: 0 },
    { springs: '#', damagedGroups: [1], expected: 1 },
    { springs: '#', damagedGroups: [2], expected: 0 },
    { springs: '#', damagedGroups: [1, 1], expected: 0 },
    { springs: '.#', damagedGroups: [1], expected: 1 },
    { springs: '#.', damagedGroups: [1], expected: 1 },
    { springs: '.....#.#........', damagedGroups: [1], expected: 0 },
    { springs: '.....#.#........', damagedGroups: [1, 1], expected: 1 },
    { springs: '?', damagedGroups: [], expected: 1 },
    { springs: '?', damagedGroups: [1], expected: 1 },
    { springs: '??', damagedGroups: [1], expected: 2 },
    { springs: '???', damagedGroups: [1], expected: 3 },
    { springs: '#??', damagedGroups: [1], expected: 1 },
  ])(
    'return $expected given springs $springs and damaged $damagedGroups',
    ({ springs, damagedGroups, expected }) => {
      expect(countDamagedArrangements({ springs, damagedGroups })).toBe(expected);
    }
  );
});

describe('unfoldRecord()', () => {
  it('handles example', () => {
    expect(unfoldRecord('???.### 1,1,3')).toBe(
      '???.###????.###????.###????.###????.### 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3'
    );
  });
});

describe('countRecordArrangements()', () => {
  it('handles example line 1', () => {
    expect(countRecordArrangements('???.### 1,1,3')).toBe(1);
  });

  it('handles example line 2', () => {
    expect(countRecordArrangements('.??..??...?##. 1,1,3')).toBe(4);
  });

  it('handles example line 3', () => {
    expect(countRecordArrangements('?#?#?#?#?#?#?#? 1,3,1,6')).toBe(1);
  });

  it('handles example line 4', () => {
    expect(countRecordArrangements('????.#...#... 4,1,1')).toBe(1);
  });

  it('handles example line 5', () => {
    expect(countRecordArrangements('????.######..#####. 1,6,5')).toBe(4);
  });

  it('handles example line 6', () => {
    expect(countRecordArrangements('?###???????? 3,2,1')).toBe(10);
  });
});

describe('countUnfoldRecordArrangements()', () => {
  it('handles example line 1', () => {
    expect(countUnfoldRecordArrangements('???.### 1,1,3')).toBe(1);
  });

  it('handles example line 2', () => {
    expect(countUnfoldRecordArrangements('.??..??...?##. 1,1,3')).toBe(16384);
  });

  it('handles example line 3', () => {
    expect(countUnfoldRecordArrangements('?#?#?#?#?#?#?#? 1,3,1,6')).toBe(1);
  });

  it('handles example line 4', () => {
    expect(countUnfoldRecordArrangements('????.#...#... 4,1,1')).toBe(16);
  });

  it('handles example line 5', () => {
    expect(countUnfoldRecordArrangements('????.######..#####. 1,6,5')).toBe(2500);
  });

  it('handles example line 6', () => {
    expect(countUnfoldRecordArrangements('?###???????? 3,2,1')).toBe(506250);
  });
});
