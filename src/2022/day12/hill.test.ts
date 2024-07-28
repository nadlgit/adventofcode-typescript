import { findFewestStepsFromAllStarts, findFewestStepsFromStart, HillMap } from './hill.js';

describe('HillMap constructor', () => {
  describe('parses example', () => {
    const createHillMap = () =>
      new HillMap(['Sabqponm', 'abcryxxl', 'accszExk', 'acctuvwj', 'abdefghi']);

    it('gets start point', () => {
      const map = createHillMap();
      expect(map.start).toEqual([0, 0]);
    });

    it('gets end point', () => {
      const map = createHillMap();
      expect(map.end).toEqual([2, 5]);
    });

    it('converts elevations to character codes (including start and end points)', () => {
      const map = createHillMap();
      expect(map.grid).toEqual([
        [
          'a'.charCodeAt(0),
          'a'.charCodeAt(0),
          'b'.charCodeAt(0),
          'q'.charCodeAt(0),
          'p'.charCodeAt(0),
          'o'.charCodeAt(0),
          'n'.charCodeAt(0),
          'm'.charCodeAt(0),
        ],
        [
          'a'.charCodeAt(0),
          'b'.charCodeAt(0),
          'c'.charCodeAt(0),
          'r'.charCodeAt(0),
          'y'.charCodeAt(0),
          'x'.charCodeAt(0),
          'x'.charCodeAt(0),
          'l'.charCodeAt(0),
        ],
        [
          'a'.charCodeAt(0),
          'c'.charCodeAt(0),
          'c'.charCodeAt(0),
          's'.charCodeAt(0),
          'z'.charCodeAt(0),
          'z'.charCodeAt(0),
          'x'.charCodeAt(0),
          'k'.charCodeAt(0),
        ],
        [
          'a'.charCodeAt(0),
          'c'.charCodeAt(0),
          'c'.charCodeAt(0),
          't'.charCodeAt(0),
          'u'.charCodeAt(0),
          'v'.charCodeAt(0),
          'w'.charCodeAt(0),
          'j'.charCodeAt(0),
        ],
        [
          'a'.charCodeAt(0),
          'b'.charCodeAt(0),
          'd'.charCodeAt(0),
          'e'.charCodeAt(0),
          'f'.charCodeAt(0),
          'g'.charCodeAt(0),
          'h'.charCodeAt(0),
          'i'.charCodeAt(0),
        ],
      ]);
    });

    it('gets all start points', () => {
      const map = createHillMap();
      expect(map.allStarts).toIncludeSameMembers([
        [0, 0],
        [0, 1],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
      ]);
    });
  });
});

describe('HillMap.findPossibleNextSteps()', () => {
  const act = (center: string, neighbour: string) =>
    new HillMap([
      neighbour.repeat(3),
      neighbour + center + neighbour,
      neighbour.repeat(3),
    ]).findPossibleNextSteps([1, 1]);
  const expectSelected = (positions: unknown[]) => {
    expect(positions).toIncludeSameMembers([
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
    ]);
  };
  const expectIgnored = (positions: unknown[]) => {
    expect(positions).toBeEmpty();
  };

  it('selects elevation 3 lower', () => {
    const positions = act('d', 'b');
    expectSelected(positions);
  });

  it('selects elevation 2 lower', () => {
    const positions = act('d', 'c');
    expectSelected(positions);
  });

  it('selects elevation 1 lower', () => {
    const positions = act('d', 'e');
    expectSelected(positions);
  });

  it('selects same elevation', () => {
    const positions = act('d', 'd');
    expectSelected(positions);
  });

  it('selects elevation 1 higher', () => {
    const positions = act('d', 'e');
    expectSelected(positions);
  });

  it('ignores elevation 2 higher', () => {
    const positions = act('d', 'f');
    expectIgnored(positions);
  });

  it('ignores elevation 3 higher', () => {
    const positions = act('d', 'g');
    expectIgnored(positions);
  });
});

describe('findFewestStepsFromStart()', () => {
  it('handles example', () => {
    const map = new HillMap(['Sabqponm', 'abcryxxl', 'accszExk', 'acctuvwj', 'abdefghi']);
    expect(findFewestStepsFromStart(map)).toBe(31);
  });
});

describe('findFewestStepsFromAllStarts()', () => {
  it('handles example', () => {
    const map = new HillMap(['Sabqponm', 'abcryxxl', 'accszExk', 'acctuvwj', 'abdefghi']);
    expect(findFewestStepsFromAllStarts(map)).toBe(29);
  });
});
