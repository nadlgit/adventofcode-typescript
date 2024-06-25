import {
  findGroupCommonItemType,
  findRucksackDuplicatedItemType,
  getItemPriority,
  getRucksacksGroups,
} from './rucksack.js';

describe('findRucksackDuplicatedItemType()', () => {
  it.each([
    { rucksack: 'vJrwpWtwJgWrhcsFMMfFFhFp', expected: 'p' },
    { rucksack: 'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL', expected: 'L' },
    { rucksack: 'PmmdzqPrVvPwwTWBwg', expected: 'P' },
    { rucksack: 'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn', expected: 'v' },
    { rucksack: 'ttgJtRGJQctTZtZT', expected: 't' },
    { rucksack: 'CrZsJsPPZsGzwwsLwLmpwMDw', expected: 's' },
  ])('returns $expected for $rucksack', ({ rucksack, expected }) => {
    expect(findRucksackDuplicatedItemType(rucksack)).toBe(expected);
  });
});

describe('getItemPriority()', () => {
  it.each([
    { item: 'a', expected: 1 },
    { item: 'z', expected: 26 },
    { item: 'A', expected: 27 },
    { item: 'Z', expected: 52 },
  ])('returns $expected for $item', ({ item, expected }) => {
    expect(getItemPriority(item)).toBe(expected);
  });
});

describe('findGroupCommonItemType()', () => {
  it('handles example group 1', () => {
    expect(
      findGroupCommonItemType([
        'vJrwpWtwJgWrhcsFMMfFFhFp',
        'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
        'PmmdzqPrVvPwwTWBwg',
      ])
    ).toBe('r');
  });

  it('handles example group 2', () => {
    expect(
      findGroupCommonItemType([
        'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
        'ttgJtRGJQctTZtZT',
        'CrZsJsPPZsGzwwsLwLmpwMDw',
      ])
    ).toBe('Z');
  });
});

describe('getRucksacksGroups()', () => {
  it('splits 3 lines into 1 group', () => {
    expect(getRucksacksGroups(['line01', 'line02', 'line03'])).toEqual([
      ['line01', 'line02', 'line03'],
    ]);
  });

  it('splits 12 lines into 4 groups', () => {
    expect(
      getRucksacksGroups([
        'line01',
        'line02',
        'line03',
        'line04',
        'line05',
        'line06',
        'line07',
        'line08',
        'line09',
        'line10',
        'line11',
        'line12',
      ])
    ).toEqual([
      ['line01', 'line02', 'line03'],
      ['line04', 'line05', 'line06'],
      ['line07', 'line08', 'line09'],
      ['line10', 'line11', 'line12'],
    ]);
  });
});
