import { TreeMap } from './trees.js';

describe('TreeMap', () => {
  describe('isTreeVisibleFromOutside()', () => {
    it('handles example', () => {
      // prettier-ignore
      const treemap = new TreeMap([
        '30373',
        '25512',
        '65332',
        '33549',
        '35390'
      ]);
      const result: boolean[][] = [];
      for (let row = 0; row < 5; row++) {
        result.push([]);
        for (let col = 0; col < 5; col++) {
          result[row].push(treemap.isTreeVisibleFromOutside([row, col]));
        }
      }
      expect(result).toEqual([
        [true, true, true, true, true],
        [true, true, true, false, true],
        [true, true, false, true, true],
        [true, false, true, false, true],
        [true, true, true, true, true],
      ]);
    });
  });

  describe('getTreeViewingDistances()', () => {
    it('handles example', () => {
      // prettier-ignore
      const treemap = new TreeMap([
        '30373',
        '25512',
        '65332',
        '33549',
        '35390'
      ]);
      const result: Record<'left' | 'right' | 'up' | 'down', number>[][] = [];
      for (let row = 0; row < 5; row++) {
        result.push([]);
        for (let col = 0; col < 5; col++) {
          result[row].push(treemap.getTreeViewingDistances([row, col]));
        }
      }
      expect(result).toEqual([
        [
          { left: 0, right: 2, up: 0, down: 2 },
          { left: 1, right: 1, up: 0, down: 1 },
          { left: 2, right: 1, up: 0, down: 1 },
          { left: 3, right: 1, up: 0, down: 4 },
          { left: 1, right: 0, up: 0, down: 3 },
        ],
        [
          { left: 0, right: 1, up: 1, down: 1 },
          { left: 1, right: 1, up: 1, down: 1 },
          { left: 1, right: 2, up: 1, down: 2 },
          { left: 1, right: 1, up: 1, down: 1 },
          { left: 2, right: 0, up: 1, down: 1 },
        ],
        [
          { left: 0, right: 4, up: 2, down: 2 },
          { left: 1, right: 3, up: 1, down: 2 },
          { left: 1, right: 1, up: 1, down: 1 },
          { left: 1, right: 1, up: 2, down: 1 },
          { left: 1, right: 0, up: 1, down: 1 },
        ],
        [
          { left: 0, right: 1, up: 1, down: 1 },
          { left: 1, right: 1, up: 1, down: 1 },
          { left: 2, right: 2, up: 2, down: 1 },
          { left: 1, right: 1, up: 3, down: 1 },
          { left: 4, right: 0, up: 3, down: 1 },
        ],
        [
          { left: 0, right: 1, up: 1, down: 0 },
          { left: 1, right: 2, up: 2, down: 0 },
          { left: 1, right: 1, up: 1, down: 0 },
          { left: 3, right: 1, up: 4, down: 0 },
          { left: 1, right: 0, up: 1, down: 0 },
        ],
      ]);
    });
  });
});
