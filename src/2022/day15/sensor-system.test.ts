import {
  findDistressBeacon,
  findMissingRanges,
  findSensorRowCoverage,
  findSortedRowFilledColumns,
  parseSensorReport,
} from './sensor-system.js';

describe('parseSensorReport()', () => {
  it('parses 1 line', () => {
    const lines = ['Sensor at x=2, y=18: closest beacon is at x=-2, y=15'];
    expect(parseSensorReport(lines)).toEqual([
      { position: { x: 2, y: 18 }, closestBeacon: { x: -2, y: 15 }, distance: 7 },
    ]);
  });

  it('ignores empty line', () => {
    const lines = [''];
    expect(parseSensorReport(lines)).toBeEmpty();
  });

  it('handles example', () => {
    const lines = [
      'Sensor at x=2, y=18: closest beacon is at x=-2, y=15',
      'Sensor at x=9, y=16: closest beacon is at x=10, y=16',
      'Sensor at x=13, y=2: closest beacon is at x=15, y=3',
      'Sensor at x=12, y=14: closest beacon is at x=10, y=16',
      'Sensor at x=10, y=20: closest beacon is at x=10, y=16',
      'Sensor at x=14, y=17: closest beacon is at x=10, y=16',
      'Sensor at x=8, y=7: closest beacon is at x=2, y=10',
      'Sensor at x=2, y=0: closest beacon is at x=2, y=10',
      'Sensor at x=0, y=11: closest beacon is at x=2, y=10',
      'Sensor at x=20, y=14: closest beacon is at x=25, y=17',
      'Sensor at x=17, y=20: closest beacon is at x=21, y=22',
      'Sensor at x=16, y=7: closest beacon is at x=15, y=3',
      'Sensor at x=14, y=3: closest beacon is at x=15, y=3',
      'Sensor at x=20, y=1: closest beacon is at x=15, y=3',
    ];
    expect(parseSensorReport(lines)).toIncludeSameMembers([
      { position: { x: 2, y: 18 }, closestBeacon: { x: -2, y: 15 }, distance: 7 },
      { position: { x: 9, y: 16 }, closestBeacon: { x: 10, y: 16 }, distance: 1 },
      { position: { x: 13, y: 2 }, closestBeacon: { x: 15, y: 3 }, distance: 3 },
      { position: { x: 12, y: 14 }, closestBeacon: { x: 10, y: 16 }, distance: 4 },
      { position: { x: 10, y: 20 }, closestBeacon: { x: 10, y: 16 }, distance: 4 },
      { position: { x: 14, y: 17 }, closestBeacon: { x: 10, y: 16 }, distance: 5 },
      { position: { x: 8, y: 7 }, closestBeacon: { x: 2, y: 10 }, distance: 9 },
      { position: { x: 2, y: 0 }, closestBeacon: { x: 2, y: 10 }, distance: 10 },
      { position: { x: 0, y: 11 }, closestBeacon: { x: 2, y: 10 }, distance: 3 },
      { position: { x: 20, y: 14 }, closestBeacon: { x: 25, y: 17 }, distance: 8 },
      { position: { x: 17, y: 20 }, closestBeacon: { x: 21, y: 22 }, distance: 6 },
      { position: { x: 16, y: 7 }, closestBeacon: { x: 15, y: 3 }, distance: 5 },
      { position: { x: 14, y: 3 }, closestBeacon: { x: 15, y: 3 }, distance: 1 },
      { position: { x: 20, y: 1 }, closestBeacon: { x: 15, y: 3 }, distance: 7 },
    ]);
  });
});

describe('findSensorRowCoverage()', () => {
  const sensor = { position: { x: 0, y: 0 }, closestBeacon: { x: 1, y: 1 }, distance: 2 };

  it('ignores rows above diamond', () => {
    expect(findSensorRowCoverage(sensor, -3)).toBeNull();
  });

  it('ignores rows below diamond', () => {
    expect(findSensorRowCoverage(sensor, 3)).toBeNull();
  });

  it('selects diamond central horizontal line', () => {
    expect(findSensorRowCoverage(sensor, 0)).toEqual([-2, 2]);
  });

  it('selects diamond top vertex', () => {
    expect(findSensorRowCoverage(sensor, -2)).toEqual([0, 0]);
  });

  it('selects diamond bottom vertex', () => {
    expect(findSensorRowCoverage(sensor, 2)).toEqual([0, 0]);
  });

  it('selects diamond intermediate horizontal line', () => {
    expect(findSensorRowCoverage(sensor, -1)).toEqual([-1, 1]);
  });

  it('excludes closest beacon from selection', () => {
    expect(findSensorRowCoverage(sensor, 1)).toEqual([-1, 0]);
  });
});

describe('findSortedRowFilledColumns()', () => {
  describe('handles simple case', () => {
    const sensors = [
      { position: { x: 0, y: 0 }, closestBeacon: { x: 1, y: 1 }, distance: 2 },
      { position: { x: 2, y: 0 }, closestBeacon: { x: 1, y: 1 }, distance: 2 },
    ];

    it.each([
      [0, [[-2, 4]]],
      [-1, [[-1, 3]]],
      [
        1,
        [
          [-1, 0],
          [2, 3],
        ],
      ],
      [
        -2,
        [
          [0, 0],
          [2, 2],
        ],
      ],

      [
        2,
        [
          [0, 0],
          [2, 2],
        ],
      ],
      [-3, []],
      [3, []],
    ])('beacons excluded y=%i', (y, expected) => {
      expect(findSortedRowFilledColumns(sensors, y, false)).toEqual(expected);
    });

    it.each([
      [0, [[-2, 4]]],
      [-1, [[-1, 3]]],
      [1, [[-1, 3]]],
      [
        -2,
        [
          [0, 0],
          [2, 2],
        ],
      ],

      [
        2,
        [
          [0, 0],
          [2, 2],
        ],
      ],
      [-3, []],
      [3, []],
    ])('beacons included y=%i', (y, expected) => {
      expect(findSortedRowFilledColumns(sensors, y, true)).toEqual(expected);
    });
  });

  describe('handles example', () => {
    const sensors = [
      { position: { x: 2, y: 18 }, closestBeacon: { x: -2, y: 15 }, distance: 7 },
      { position: { x: 9, y: 16 }, closestBeacon: { x: 10, y: 16 }, distance: 1 },
      { position: { x: 13, y: 2 }, closestBeacon: { x: 15, y: 3 }, distance: 3 },
      { position: { x: 12, y: 14 }, closestBeacon: { x: 10, y: 16 }, distance: 4 },
      { position: { x: 10, y: 20 }, closestBeacon: { x: 10, y: 16 }, distance: 4 },
      { position: { x: 14, y: 17 }, closestBeacon: { x: 10, y: 16 }, distance: 5 },
      { position: { x: 8, y: 7 }, closestBeacon: { x: 2, y: 10 }, distance: 9 },
      { position: { x: 2, y: 0 }, closestBeacon: { x: 2, y: 10 }, distance: 10 },
      { position: { x: 0, y: 11 }, closestBeacon: { x: 2, y: 10 }, distance: 3 },
      { position: { x: 20, y: 14 }, closestBeacon: { x: 25, y: 17 }, distance: 8 },
      { position: { x: 17, y: 20 }, closestBeacon: { x: 21, y: 22 }, distance: 6 },
      { position: { x: 16, y: 7 }, closestBeacon: { x: 15, y: 3 }, distance: 5 },
      { position: { x: 14, y: 3 }, closestBeacon: { x: 15, y: 3 }, distance: 1 },
      { position: { x: 20, y: 1 }, closestBeacon: { x: 15, y: 3 }, distance: 7 },
    ];

    it.each([
      [
        10,
        [
          [-2, 1],
          [3, 24],
        ],
      ],
      [
        11,
        [
          [-3, 13],
          [15, 25],
        ],
      ],
    ])('beacons excluded y=%i', (y, expected) => {
      expect(findSortedRowFilledColumns(sensors, y, false)).toEqual(expected);
    });

    it.each([
      [10, [[-2, 24]]],
      [
        11,
        [
          [-3, 13],
          [15, 25],
        ],
      ],
    ])('beacons included y=%i', (y, expected) => {
      expect(findSortedRowFilledColumns(sensors, y, true)).toEqual(expected);
    });
  });
});

describe('findMissingRanges()', () => {
  it('finds nothing given only 1 range', () => {
    expect(findMissingRanges([[-1, 3]])).toBeEmpty();
  });

  it('finds nothing given 2 adjacent ranges', () => {
    expect(
      findMissingRanges([
        [-1, 1],
        [2, 3],
      ])
    ).toBeEmpty();
  });

  it('finds 1-value range', () => {
    expect(
      findMissingRanges([
        [-1, 0],
        [2, 3],
      ])
    ).toEqual([[1, 1]]);
  });

  it('finds 2-value range', () => {
    expect(
      findMissingRanges([
        [2, 3],
        [6, 10],
      ])
    ).toEqual([[4, 5]]);
  });

  it('finds multiples ranges', () => {
    expect(
      findMissingRanges([
        [-1, 0],
        [2, 3],
        [6, 10],
      ])
    ).toEqual([
      [1, 1],
      [4, 5],
    ]);
  });
});

describe('findDistressBeacon()', () => {
  it('handle example', () => {
    const sensors = [
      { position: { x: 2, y: 18 }, closestBeacon: { x: -2, y: 15 }, distance: 7 },
      { position: { x: 9, y: 16 }, closestBeacon: { x: 10, y: 16 }, distance: 1 },
      { position: { x: 13, y: 2 }, closestBeacon: { x: 15, y: 3 }, distance: 3 },
      { position: { x: 12, y: 14 }, closestBeacon: { x: 10, y: 16 }, distance: 4 },
      { position: { x: 10, y: 20 }, closestBeacon: { x: 10, y: 16 }, distance: 4 },
      { position: { x: 14, y: 17 }, closestBeacon: { x: 10, y: 16 }, distance: 5 },
      { position: { x: 8, y: 7 }, closestBeacon: { x: 2, y: 10 }, distance: 9 },
      { position: { x: 2, y: 0 }, closestBeacon: { x: 2, y: 10 }, distance: 10 },
      { position: { x: 0, y: 11 }, closestBeacon: { x: 2, y: 10 }, distance: 3 },
      { position: { x: 20, y: 14 }, closestBeacon: { x: 25, y: 17 }, distance: 8 },
      { position: { x: 17, y: 20 }, closestBeacon: { x: 21, y: 22 }, distance: 6 },
      { position: { x: 16, y: 7 }, closestBeacon: { x: 15, y: 3 }, distance: 5 },
      { position: { x: 14, y: 3 }, closestBeacon: { x: 15, y: 3 }, distance: 1 },
      { position: { x: 20, y: 1 }, closestBeacon: { x: 15, y: 3 }, distance: 7 },
    ];
    expect(findDistressBeacon(sensors, 20)).toEqual({ x: 14, y: 11 });
  });
});
