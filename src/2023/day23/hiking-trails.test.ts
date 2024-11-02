import {
  findAdjacentSteps,
  findStraightSteps,
  parseTrailsMap,
  TrailsGraph,
} from './hiking-trails.js';

describe('parseTrailsMap()', () => {
  // prettier-ignore
  const lines = [
    '#.######',
    '#.v.>..#',
    '##..^.<#',
    '#####.##',
  ];

  it('parses slippery ground', () => {
    expect(parseTrailsMap(lines, 'slippery')).toIncludeSameMembers([
      { row: 0, col: 1, tile: '.' },
      { row: 1, col: 1, tile: '.' },
      { row: 1, col: 2, tile: 'v' },
      { row: 1, col: 3, tile: '.' },
      { row: 1, col: 4, tile: '>' },
      { row: 1, col: 5, tile: '.' },
      { row: 1, col: 6, tile: '.' },
      { row: 2, col: 2, tile: '.' },
      { row: 2, col: 3, tile: '.' },
      { row: 2, col: 4, tile: '^' },
      { row: 2, col: 5, tile: '.' },
      { row: 2, col: 6, tile: '<' },
      { row: 3, col: 5, tile: '.' },
    ]);
  });

  it('parses dry ground', () => {
    expect(parseTrailsMap(lines, 'dry')).toIncludeSameMembers([
      { row: 0, col: 1, tile: '.' },
      { row: 1, col: 1, tile: '.' },
      { row: 1, col: 2, tile: '.' },
      { row: 1, col: 3, tile: '.' },
      { row: 1, col: 4, tile: '.' },
      { row: 1, col: 5, tile: '.' },
      { row: 1, col: 6, tile: '.' },
      { row: 2, col: 2, tile: '.' },
      { row: 2, col: 3, tile: '.' },
      { row: 2, col: 4, tile: '.' },
      { row: 2, col: 5, tile: '.' },
      { row: 2, col: 6, tile: '.' },
      { row: 3, col: 5, tile: '.' },
    ]);
  });
});

describe('findAdjacentSteps()', () => {
  const act = (center: string, neighbour: string, ground: 'slippery' | 'dry' = 'slippery') => {
    const map = parseTrailsMap(
      [neighbour.repeat(3), neighbour + center + neighbour, neighbour.repeat(3)],
      ground
    );
    return findAdjacentSteps(map, { row: 1, col: 1 });
  };
  const top = { row: 0, col: 1, distance: 1 };
  const bottom = { row: 2, col: 1, distance: 1 };
  const left = { row: 1, col: 0, distance: 1 };
  const right = { row: 1, col: 2, distance: 1 };

  describe('given slippery ground', () => {
    it('selects paths', () => {
      const positions = act('.', '.', 'slippery');
      expect(positions).toIncludeSameMembers([top, bottom, left, right]);
    });

    it('ignores forests', () => {
      const positions = act('.', '#', 'slippery');
      expect(positions).toBeEmpty();
    });

    it.each([
      ['^', [top, left, right]],
      ['>', [top, bottom, right]],
      ['v', [bottom, left, right]],
      ['<', [top, bottom, left]],
    ])("selects slope '%s' excepting opposite direction", (slope, expected) => {
      const positions = act('.', slope, 'slippery');
      expect(positions).toIncludeSameMembers(expected);
    });

    it.each([
      ['^', [top]],
      ['>', [right]],
      ['v', [bottom]],
      ['<', [left]],
    ])("selects direction given by slope '%s'", (slope, expected) => {
      const positions = act(slope, '.', 'slippery');
      expect(positions).toEqual(expected);
    });

    it.each([
      ['^', 'v'],
      ['>', '<'],
      ['v', '^'],
      ['<', '>'],
    ])("ignores direction given by slope '%s' given opposite slope '%s'", (slope, opposite) => {
      const positions = act(slope, opposite, 'slippery');
      expect(positions).toBeEmpty();
    });
  });

  describe('given dry ground', () => {
    it('selects paths', () => {
      const positions = act('.', '.', 'dry');
      expect(positions).toIncludeSameMembers([top, bottom, left, right]);
    });

    it('ignores forests', () => {
      const positions = act('.', '#', 'dry');
      expect(positions).toBeEmpty();
    });

    it.each(['^', '>', 'v', '<'])("selects slope '%s'", (slope) => {
      const positions = act('.', slope, 'dry');
      expect(positions).toIncludeSameMembers([top, bottom, left, right]);
    });

    it.each(['^', '>', 'v', '<'])("selects valid directions from slope '%s'", (slope) => {
      const positions = act(slope, '.', 'dry');
      expect(positions).toIncludeSameMembers([top, bottom, left, right]);
    });
  });
});

describe('findStraightSteps()', () => {
  describe('handles horizontal path', () => {
    const map = parseTrailsMap(['....'], 'dry');
    const left = { row: 0, col: 0 };
    const right = { row: 0, col: 3 };
    const distance = 3;

    it('from left', () => {
      expect(findStraightSteps(map, left)).toEqual([{ ...right, distance }]);
    });

    it('from right', () => {
      expect(findStraightSteps(map, right)).toEqual([{ ...left, distance }]);
    });
  });

  describe('handles vertical path', () => {
    const map = parseTrailsMap(['.', '.', '.', '.'], 'dry');
    const top = { row: 0, col: 0 };
    const bottom = { row: 3, col: 0 };
    const distance = 3;

    it('from top', () => {
      expect(findStraightSteps(map, top)).toEqual([{ ...bottom, distance }]);
    });

    it('from bottom', () => {
      expect(findStraightSteps(map, bottom)).toEqual([{ ...top, distance }]);
    });
  });

  describe('handles path with corners', () => {
    const map = parseTrailsMap(['..##', '#.##', '#...'], 'dry');
    const end1 = { row: 0, col: 0 };
    const end2 = { row: 2, col: 3 };
    const distance = 5;

    it('one way', () => {
      expect(findStraightSteps(map, end1)).toEqual([{ ...end2, distance }]);
    });

    it('other way', () => {
      expect(findStraightSteps(map, end2)).toEqual([{ ...end1, distance }]);
    });
  });

  describe('handles path intersection', () => {
    const map = parseTrailsMap(['#.##', '#.##', '....', '#.##'], 'dry');
    const intersection = { row: 2, col: 1 };
    const left = { position: { row: 2, col: 0 }, distance: 1 };
    const right = { position: { row: 2, col: 3 }, distance: 2 };
    const top = { position: { row: 0, col: 1 }, distance: 2 };
    const bottom = { position: { row: 3, col: 1 }, distance: 1 };

    it.each([
      ['left', left],
      ['right', right],
      ['top', top],
      ['bottom', bottom],
    ])('from %s', (_, step) => {
      expect(findStraightSteps(map, step.position)).toEqual([
        { ...intersection, distance: step.distance },
      ]);
    });

    it('from intersection', () => {
      expect(findStraightSteps(map, intersection)).toIncludeSameMembers([
        { ...left.position, distance: left.distance },
        { ...right.position, distance: right.distance },
        { ...top.position, distance: top.distance },
        { ...bottom.position, distance: bottom.distance },
      ]);
    });
  });

  it('ignores middle steps', () => {
    const map = parseTrailsMap(['....'], 'dry');
    expect(findStraightSteps(map, { row: 0, col: 1 })).toBeEmpty();
  });
});

describe('TrailsGraph constructor', () => {
  let graph: TrailsGraph;
  beforeEach(() => {
    graph = new TrailsGraph(
      [
        '#.###################',
        '#.......#########...#',
        '#######.#####.....#.#',
        '###.......>.>.###.#.#',
        '###################.#',
      ],
      'slippery'
    );
  });

  it('initializes start position', () => {
    expect(graph.start).toEqual({ row: 0, col: 1 });
  });

  it('initializes end position', () => {
    expect(graph.end).toEqual({ row: 4, col: 19 });
  });
});

describe('TrailsGraph.findLongestPathSteps()', () => {
  describe('handles example', () => {
    const lines = [
      '#.#####################',
      '#.......#########...###',
      '#######.#########.#.###',
      '###.....#.>.>.###.#.###',
      '###v#####.#v#.###.#.###',
      '###.>...#.#.#.....#...#',
      '###v###.#.#.#########.#',
      '###...#.#.#.......#...#',
      '#####.#.#.#######.#.###',
      '#.....#.#.#.......#...#',
      '#.#####.#.#.#########v#',
      '#.#...#...#...###...>.#',
      '#.#.#v#######v###.###v#',
      '#...#.>.#...>.>.#.###.#',
      '#####v#.#.###v#.#.###.#',
      '#.....#...#...#.#.#...#',
      '#.#########.###.#.#.###',
      '#...###...#...#...#.###',
      '###.###.#.###v#####v###',
      '#...#...#.#.>.>.#.>.###',
      '#.###.###.#.###.#.#v###',
      '#.....###...###...#...#',
      '#####################.#',
    ];

    it('given slippery ground', () => {
      const graph = new TrailsGraph(lines, 'slippery');
      expect(graph.findLongestPathLength()).toBe(94);
    });

    it('given dry ground', () => {
      const graph = new TrailsGraph(lines, 'dry');
      expect(graph.findLongestPathLength()).toBe(154);
    });
  });
});
