import { Maze } from './maze.js';

describe('maze.getConnectedPipes()', () => {
  const validConnections = [
    { pipe: '-', on: 'left', ofPipe: '-' },
    { pipe: '-', on: 'right', ofPipe: '-' },
    { pipe: 'F', on: 'left', ofPipe: '-' },
    { pipe: '7', on: 'right', ofPipe: '-' },
    { pipe: 'L', on: 'left', ofPipe: '-' },
    { pipe: 'J', on: 'right', ofPipe: '-' },
    { pipe: '|', on: 'top', ofPipe: '|' },
    { pipe: '|', on: 'bottom', ofPipe: '|' },
    { pipe: 'F', on: 'top', ofPipe: '|' },
    { pipe: '7', on: 'top', ofPipe: '|' },
    { pipe: 'L', on: 'bottom', ofPipe: '|' },
    { pipe: 'J', on: 'bottom', ofPipe: '|' },
    { pipe: '-', on: 'right', ofPipe: 'F' },
    { pipe: '|', on: 'bottom', ofPipe: 'F' },
    { pipe: '7', on: 'right', ofPipe: 'F' },
    { pipe: 'L', on: 'bottom', ofPipe: 'F' },
    { pipe: 'J', on: 'bottom', ofPipe: 'F' },
    { pipe: 'J', on: 'right', ofPipe: 'F' },
    { pipe: '-', on: 'left', ofPipe: '7' },
    { pipe: '|', on: 'bottom', ofPipe: '7' },
    { pipe: 'F', on: 'left', ofPipe: '7' },
    { pipe: 'L', on: 'left', ofPipe: '7' },
    { pipe: 'L', on: 'bottom', ofPipe: '7' },
    { pipe: 'J', on: 'bottom', ofPipe: '7' },
    { pipe: '-', on: 'right', ofPipe: 'L' },
    { pipe: '|', on: 'top', ofPipe: 'L' },
    { pipe: 'F', on: 'top', ofPipe: 'L' },
    { pipe: '7', on: 'top', ofPipe: 'L' },
    { pipe: '7', on: 'right', ofPipe: 'L' },
    { pipe: 'J', on: 'right', ofPipe: 'L' },
    { pipe: '-', on: 'left', ofPipe: 'J' },
    { pipe: '|', on: 'top', ofPipe: 'J' },
    { pipe: 'F', on: 'left', ofPipe: 'J' },
    { pipe: 'F', on: 'top', ofPipe: 'J' },
    { pipe: '7', on: 'top', ofPipe: 'J' },
    { pipe: 'L', on: 'left', ofPipe: 'J' },
    // start pipe
    { pipe: '-', on: 'left', ofPipe: 'S' },
    { pipe: 'S', on: 'right', ofPipe: '-' },
    { pipe: '-', on: 'right', ofPipe: 'S' },
    { pipe: 'S', on: 'left', ofPipe: '-' },
    { pipe: '|', on: 'top', ofPipe: 'S' },
    { pipe: 'S', on: 'bottom', ofPipe: '|' },
    { pipe: '|', on: 'bottom', ofPipe: 'S' },
    { pipe: 'S', on: 'top', ofPipe: '|' },
    { pipe: 'F', on: 'left', ofPipe: 'S' },
    { pipe: 'S', on: 'right', ofPipe: 'F' },
    { pipe: 'F', on: 'top', ofPipe: 'S' },
    { pipe: 'S', on: 'bottom', ofPipe: 'F' },
    { pipe: '7', on: 'right', ofPipe: 'S' },
    { pipe: 'S', on: 'left', ofPipe: '7' },
    { pipe: '7', on: 'top', ofPipe: 'S' },
    { pipe: 'S', on: 'bottom', ofPipe: '7' },
    { pipe: 'L', on: 'left', ofPipe: 'S' },
    { pipe: 'S', on: 'right', ofPipe: 'L' },
    { pipe: 'L', on: 'bottom', ofPipe: 'S' },
    { pipe: 'S', on: 'top', ofPipe: 'L' },
    { pipe: 'J', on: 'right', ofPipe: 'S' },
    { pipe: 'S', on: 'left', ofPipe: 'J' },
    { pipe: 'J', on: 'bottom', ofPipe: 'S' },
    { pipe: 'S', on: 'top', ofPipe: 'J' },
  ];

  const pipes = ['-', '|', 'F', '7', 'L', 'J', 'S'];
  describe.each(pipes)('pipe "%s"', (adjacentPipe) => {
    describe.each(['top', 'bottom', 'left', 'right'])('on "%s" of', (adjacentPositionName) => {
      describe.each(pipes)('pipe "%s"', (testedPipe) => {
        const topTile = adjacentPositionName === 'top' ? adjacentPipe : '.';
        const bottomTile = adjacentPositionName === 'bottom' ? adjacentPipe : '.';
        const leftTile = adjacentPositionName === 'left' ? adjacentPipe : '.';
        const rightTile = adjacentPositionName === 'right' ? adjacentPipe : '.';
        const maze = new Maze([
          `.${topTile}.`,
          `${leftTile}${testedPipe}${rightTile}`,
          `.${bottomTile}.`,
        ]);
        const isValidConnection = validConnections.some(
          ({ pipe, on, ofPipe }) =>
            pipe === adjacentPipe && on === adjacentPositionName && ofPipe === testedPipe
        );

        it(isValidConnection ? 'is selected' : 'is ignored', () => {
          expect(maze.getConnectedPipes([1, 1])).toEqual(
            isValidConnection
              ? (() => {
                  switch (adjacentPositionName) {
                    case 'top':
                      return [[0, 1]];
                    case 'bottom':
                      return [[2, 1]];
                    case 'left':
                      return [[1, 0]];
                    case 'right':
                      return [[1, 2]];
                  }
                  return [];
                })()
              : []
          );
        });
      });
    });
  });
});

describe('maze.detectLoopBoundary()', () => {
  it('detects and sorts boundary points', () => {
    // prettier-ignore
    const maze = new Maze([
      '-L|F7',
      '7S-7|',
      'L|7||',
      '-L-J|',
      'L|-JF'
    ]);
    expect(maze.detectLoopBoundary()).toBeOneOf([
      [
        [1, 1],
        [1, 2],
        [1, 3],
        [2, 3],
        [3, 3],
        [3, 2],
        [3, 1],
        [2, 1],
      ],
      [
        [1, 1],
        [2, 1],
        [3, 1],
        [3, 2],
        [3, 3],
        [2, 3],
        [1, 3],
        [1, 2],
      ],
    ]);
  });
});

describe('maze.isVertex()', () => {
  it.each([
    ['ignores straight pipe "-"', [1, 2], false],
    ['ignores straight pipe "|"', [2, 1], false],
    ['selects angle pipe "F"', [1, 1], true],
    ['selects angle pipe "7"', [1, 3], true],
    ['selects angle pipe "J"', [3, 3], true],
    ['selects angle pipe "J"', [3, 1], true],
    ['ignores unconnected angle pipe "F"', [0, 3], false],
  ])('%s', (_, position, expected) => {
    // prettier-ignore
    const maze = new Maze([
      '-L|F7',
      '7F-7|',
      'L|7S|',
      '-L-J|',
      'L|-JF'
    ]);
    expect(maze.isVertex(position as [number, number])).toBe(expected);
  });
});
