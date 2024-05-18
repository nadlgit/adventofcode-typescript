import {
  findDestination,
  findRangeDestinations,
  findSeedLocation,
  findSeedRangesLocations,
  parseAlmanac,
  seedsNumsToRanges,
} from './almanac.js';

describe('parseAlmanac()', () => {
  it('handles example', () => {
    const lines = [
      'seeds: 79 14 55 13',
      '',
      'seed-to-soil map:',
      '50 98 2',
      '52 50 48',
      '',
      'soil-to-fertilizer map:',
      '0 15 37',
      '37 52 2',
      '39 0 15',
      '',
      'fertilizer-to-water map:',
      '49 53 8',
      '0 11 42',
      '42 0 7',
      '57 7 4',
      '',
      'water-to-light map:',
      '88 18 7',
      '18 25 70',
      '',
      'light-to-temperature map:',
      '45 77 23',
      '81 45 19',
      '68 64 13',
      '',
      'temperature-to-humidity map:',
      '0 69 1',
      '1 0 69',
      '',
      'humidity-to-location map:',
      '60 56 37',
      '56 93 4',
    ];
    const almanac = parseAlmanac(lines);
    expect(almanac.seeds).toEqual([79, 14, 55, 13]);
    expect(almanac['seed-to-soil']).toEqual([
      { destination: 50, source: 98, length: 2 },
      { destination: 52, source: 50, length: 48 },
    ]);
    expect(almanac['soil-to-fertilizer']).toEqual([
      { destination: 0, source: 15, length: 37 },
      { destination: 37, source: 52, length: 2 },
      { destination: 39, source: 0, length: 15 },
    ]);
    expect(almanac['fertilizer-to-water']).toEqual([
      { destination: 49, source: 53, length: 8 },
      { destination: 0, source: 11, length: 42 },
      { destination: 42, source: 0, length: 7 },
      { destination: 57, source: 7, length: 4 },
    ]);
    expect(almanac['water-to-light']).toEqual([
      { destination: 88, source: 18, length: 7 },
      { destination: 18, source: 25, length: 70 },
    ]);
    expect(almanac['light-to-temperature']).toEqual([
      { destination: 45, source: 77, length: 23 },
      { destination: 81, source: 45, length: 19 },
      { destination: 68, source: 64, length: 13 },
    ]);
    expect(almanac['temperature-to-humidity']).toEqual([
      { destination: 0, source: 69, length: 1 },
      { destination: 1, source: 0, length: 69 },
    ]);
    expect(almanac['humidity-to-location']).toEqual([
      { destination: 60, source: 56, length: 37 },
      { destination: 56, source: 93, length: 4 },
    ]);
  });
});

describe('findDestination()', () => {
  const map = [
    { destination: 50, source: 98, length: 2 },
    { destination: 52, source: 50, length: 48 },
  ];

  describe('handles mapped source', () => {
    it.each([
      { source: 50, expected: 52 },
      { source: 60, expected: 62 },
      { source: 97, expected: 99 },
      { source: 98, expected: 50 },
      { source: 99, expected: 51 },
    ])('$source -> $expected', ({ source, expected }) => {
      expect(findDestination(source, map)).toBe(expected);
    });
  });

  describe('returns directly unmapped source', () => {
    it.each([0, 49, 100])('%i', (source) => {
      expect(findDestination(source, map)).toBe(source);
    });
  });
});

describe('findSeedLocation()', () => {
  describe('handles example', () => {
    const almanacMaps = {
      'seed-to-soil': [
        { destination: 50, source: 98, length: 2 },
        { destination: 52, source: 50, length: 48 },
      ],
      'soil-to-fertilizer': [
        { destination: 0, source: 15, length: 37 },
        { destination: 37, source: 52, length: 2 },
        { destination: 39, source: 0, length: 15 },
      ],
      'fertilizer-to-water': [
        { destination: 49, source: 53, length: 8 },
        { destination: 0, source: 11, length: 42 },
        { destination: 42, source: 0, length: 7 },
        { destination: 57, source: 7, length: 4 },
      ],
      'water-to-light': [
        { destination: 88, source: 18, length: 7 },
        { destination: 18, source: 25, length: 70 },
      ],
      'light-to-temperature': [
        { destination: 45, source: 77, length: 23 },
        { destination: 81, source: 45, length: 19 },
        { destination: 68, source: 64, length: 13 },
      ],
      'temperature-to-humidity': [
        { destination: 0, source: 69, length: 1 },
        { destination: 1, source: 0, length: 69 },
      ],
      'humidity-to-location': [
        { destination: 60, source: 56, length: 37 },
        { destination: 56, source: 93, length: 4 },
      ],
    };

    it.each([
      { seed: 79, expected: 82 },
      { seed: 14, expected: 43 },
      { seed: 55, expected: 86 },
      { seed: 13, expected: 35 },
    ])('$seed -> $expected', ({ seed, expected }) => {
      expect(findSeedLocation(seed, almanacMaps)).toBe(expected);
    });
  });
});

describe('seedsNumsToRanges()', () => {
  it('splits number list to range list', () => {
    expect(seedsNumsToRanges([79, 14, 55, 13])).toIncludeSameMembers([
      [79, 14],
      [55, 13],
    ]);
  });
});

describe('findRangeDestinations()', () => {
  const map = [
    { destination: 101, source: 11, length: 10 },
    { destination: 52, source: 50, length: 5 },
  ];

  it('given source equals 1 map range', () => {
    expect(findRangeDestinations([11, 10], map)).toIncludeSameMembers([[101, 10]]);
  });

  it('given source before all map ranges', () => {
    expect(findRangeDestinations([6, 5], map)).toIncludeSameMembers([[6, 5]]);
  });

  it('given source after all map ranges', () => {
    expect(findRangeDestinations([58, 3], map)).toIncludeSameMembers([[58, 3]]);
  });

  it('given source between 2 map ranges', () => {
    expect(findRangeDestinations([21, 6], map)).toIncludeSameMembers([[21, 6]]);
  });

  it('given source including 1 map range at middle', () => {
    expect(findRangeDestinations([6, 20], map)).toIncludeSameMembers([
      [6, 5],
      [101, 10],
      [21, 5],
    ]);
  });

  it('given source overlapping 1 map range start', () => {
    expect(findRangeDestinations([6, 10], map)).toIncludeSameMembers([
      [6, 5],
      [101, 5],
    ]);
  });

  it('given source overlapping 1 map range end', () => {
    expect(findRangeDestinations([16, 10], map)).toIncludeSameMembers([
      [106, 5],
      [21, 5],
    ]);
  });

  it('given source involving 2 map ranges', () => {
    expect(findRangeDestinations([6, 47], map)).toIncludeSameMembers([
      [6, 5],
      [101, 10],
      [21, 29],
      [52, 3],
    ]);
  });
});

describe('findSeedRangesLocations()', () => {
  it('handles example seed 82', () => {
    const almanacMaps = {
      'seed-to-soil': [
        { destination: 50, source: 98, length: 2 },
        { destination: 52, source: 50, length: 48 },
      ],
      'soil-to-fertilizer': [
        { destination: 0, source: 15, length: 37 },
        { destination: 37, source: 52, length: 2 },
        { destination: 39, source: 0, length: 15 },
      ],
      'fertilizer-to-water': [
        { destination: 49, source: 53, length: 8 },
        { destination: 0, source: 11, length: 42 },
        { destination: 42, source: 0, length: 7 },
        { destination: 57, source: 7, length: 4 },
      ],
      'water-to-light': [
        { destination: 88, source: 18, length: 7 },
        { destination: 18, source: 25, length: 70 },
      ],
      'light-to-temperature': [
        { destination: 45, source: 77, length: 23 },
        { destination: 81, source: 45, length: 19 },
        { destination: 68, source: 64, length: 13 },
      ],
      'temperature-to-humidity': [
        { destination: 0, source: 69, length: 1 },
        { destination: 1, source: 0, length: 69 },
      ],
      'humidity-to-location': [
        { destination: 60, source: 56, length: 37 },
        { destination: 56, source: 93, length: 4 },
      ],
    };
    expect(findSeedRangesLocations([[82, 1]], almanacMaps)).toEqual([[46, 1]]);
  });
});
