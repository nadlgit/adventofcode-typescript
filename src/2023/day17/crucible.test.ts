import { CityBlocks, findPathLeastHeatLoss, type PathStep } from './crucible.js';

describe('CityBlocks.findPossibleNextSteps()', () => {
  describe('given basic crucible', () => {
    it.each<PathStep['directionTo']>(['left', 'right'])(
      'selects 3 blocks above and 3 blocks below given current step going %s',
      (directionTo) => {
        const blocks = new CityBlocks([
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
        ]);
        const nextSteps = blocks.findPossibleNextSteps(
          {
            row: 4,
            col: 4,
            directionTo,
            heatLoss: 0,
          },
          'basic'
        );
        expect(nextSteps).toIncludeSameMembers([
          { row: 3, col: 4, directionTo: 'up', heatLoss: 0 },
          { row: 2, col: 4, directionTo: 'up', heatLoss: 0 },
          { row: 1, col: 4, directionTo: 'up', heatLoss: 0 },
          { row: 5, col: 4, directionTo: 'down', heatLoss: 0 },
          { row: 6, col: 4, directionTo: 'down', heatLoss: 0 },
          { row: 7, col: 4, directionTo: 'down', heatLoss: 0 },
        ]);
      }
    );

    it.each<PathStep['directionTo']>(['up', 'down'])(
      'selects 3 blocks left and 3 blocks right given current step going %s',
      (directionTo) => {
        const blocks = new CityBlocks([
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
          '000000000',
        ]);
        const nextSteps = blocks.findPossibleNextSteps(
          {
            row: 4,
            col: 4,
            directionTo,
            heatLoss: 0,
          },
          'basic'
        );
        expect(nextSteps).toIncludeSameMembers([
          { row: 4, col: 3, directionTo: 'left', heatLoss: 0 },
          { row: 4, col: 2, directionTo: 'left', heatLoss: 0 },
          { row: 4, col: 1, directionTo: 'left', heatLoss: 0 },
          { row: 4, col: 5, directionTo: 'right', heatLoss: 0 },
          { row: 4, col: 6, directionTo: 'right', heatLoss: 0 },
          { row: 4, col: 7, directionTo: 'right', heatLoss: 0 },
        ]);
      }
    );

    it('adds path heat loss to current step heat loss', () => {
      const blocks = new CityBlocks(['12345']);
      const nextSteps = blocks.findPossibleNextSteps(
        {
          row: 0,
          col: 0,
          directionTo: 'down',
          heatLoss: 10,
        },
        'basic'
      );
      expect(nextSteps).toIncludeSameMembers([
        { row: 0, col: 1, directionTo: 'right', heatLoss: 12 },
        { row: 0, col: 2, directionTo: 'right', heatLoss: 15 },
        { row: 0, col: 3, directionTo: 'right', heatLoss: 19 },
      ]);
    });
  });

  describe('given ultra crucible', () => {
    it.each<PathStep['directionTo']>(['left', 'right'])(
      'selects 4th to 10th blocks above and 4th to 10th blocks blocks below given current step going %s',
      (directionTo) => {
        const blocks = new CityBlocks([
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
        ]);
        const nextSteps = blocks.findPossibleNextSteps(
          {
            row: 11,
            col: 11,
            directionTo,
            heatLoss: 0,
          },
          'ultra'
        );
        expect(nextSteps).toIncludeSameMembers([
          { row: 7, col: 11, directionTo: 'up', heatLoss: 0 },
          { row: 6, col: 11, directionTo: 'up', heatLoss: 0 },
          { row: 5, col: 11, directionTo: 'up', heatLoss: 0 },
          { row: 4, col: 11, directionTo: 'up', heatLoss: 0 },
          { row: 3, col: 11, directionTo: 'up', heatLoss: 0 },
          { row: 2, col: 11, directionTo: 'up', heatLoss: 0 },
          { row: 1, col: 11, directionTo: 'up', heatLoss: 0 },
          { row: 15, col: 11, directionTo: 'down', heatLoss: 0 },
          { row: 16, col: 11, directionTo: 'down', heatLoss: 0 },
          { row: 17, col: 11, directionTo: 'down', heatLoss: 0 },
          { row: 18, col: 11, directionTo: 'down', heatLoss: 0 },
          { row: 19, col: 11, directionTo: 'down', heatLoss: 0 },
          { row: 20, col: 11, directionTo: 'down', heatLoss: 0 },
          { row: 21, col: 11, directionTo: 'down', heatLoss: 0 },
        ]);
      }
    );

    it.each<PathStep['directionTo']>(['up', 'down'])(
      'selects 4th to 10th blocks blocks left and 4th to 10th blocks blocks right given current step going %s',
      (directionTo) => {
        const blocks = new CityBlocks([
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
          '00000000000000000000000',
        ]);
        const nextSteps = blocks.findPossibleNextSteps(
          {
            row: 11,
            col: 11,
            directionTo,
            heatLoss: 0,
          },
          'ultra'
        );
        expect(nextSteps).toIncludeSameMembers([
          { row: 11, col: 7, directionTo: 'left', heatLoss: 0 },
          { row: 11, col: 6, directionTo: 'left', heatLoss: 0 },
          { row: 11, col: 5, directionTo: 'left', heatLoss: 0 },
          { row: 11, col: 4, directionTo: 'left', heatLoss: 0 },
          { row: 11, col: 3, directionTo: 'left', heatLoss: 0 },
          { row: 11, col: 2, directionTo: 'left', heatLoss: 0 },
          { row: 11, col: 1, directionTo: 'left', heatLoss: 0 },
          { row: 11, col: 15, directionTo: 'right', heatLoss: 0 },
          { row: 11, col: 16, directionTo: 'right', heatLoss: 0 },
          { row: 11, col: 17, directionTo: 'right', heatLoss: 0 },
          { row: 11, col: 18, directionTo: 'right', heatLoss: 0 },
          { row: 11, col: 19, directionTo: 'right', heatLoss: 0 },
          { row: 11, col: 20, directionTo: 'right', heatLoss: 0 },
          { row: 11, col: 21, directionTo: 'right', heatLoss: 0 },
        ]);
      }
    );

    it('adds path heat loss to current step heat loss', () => {
      const blocks = new CityBlocks(['111123456781']);
      const nextSteps = blocks.findPossibleNextSteps(
        {
          row: 0,
          col: 0,
          directionTo: 'down',
          heatLoss: 10,
        },
        'ultra'
      );
      expect(nextSteps).toIncludeSameMembers([
        { row: 0, col: 4, directionTo: 'right', heatLoss: 15 },
        { row: 0, col: 5, directionTo: 'right', heatLoss: 18 },
        { row: 0, col: 6, directionTo: 'right', heatLoss: 22 },
        { row: 0, col: 7, directionTo: 'right', heatLoss: 27 },
        { row: 0, col: 8, directionTo: 'right', heatLoss: 33 },
        { row: 0, col: 9, directionTo: 'right', heatLoss: 40 },
        { row: 0, col: 10, directionTo: 'right', heatLoss: 48 },
      ]);
    });
  });
});

describe('findPathLeastHeatLoss()', () => {
  describe('given basic crucible', () => {
    it('handles simple case 1', () => {
      const blocks = new CityBlocks(['11111', '22222']);
      expect(findPathLeastHeatLoss(blocks, 'basic')).toBe(7);
    });

    it('handles simple case 2', () => {
      const blocks = new CityBlocks(['22222', '11111']);
      expect(findPathLeastHeatLoss(blocks, 'basic')).toBe(6);
    });

    it('handles example 1', () => {
      const blocks = new CityBlocks([
        '2413432311323',
        '3215453535623',
        '3255245654254',
        '3446585845452',
        '4546657867536',
        '1438598798454',
        '4457876987766',
        '3637877979653',
        '4654967986887',
        '4564679986453',
        '1224686865563',
        '2546548887735',
        '4322674655533',
      ]);
      expect(findPathLeastHeatLoss(blocks, 'basic')).toBe(102);
    });
  });

  describe('given ultra crucible', () => {
    it('handles example 1', () => {
      const blocks = new CityBlocks([
        '2413432311323',
        '3215453535623',
        '3255245654254',
        '3446585845452',
        '4546657867536',
        '1438598798454',
        '4457876987766',
        '3637877979653',
        '4654967986887',
        '4564679986453',
        '1224686865563',
        '2546548887735',
        '4322674655533',
      ]);
      expect(findPathLeastHeatLoss(blocks, 'ultra')).toBe(94);
    });

    it('handles example 2', () => {
      const blocks = new CityBlocks([
        '111111111111',
        '999999999991',
        '999999999991',
        '999999999991',
        '999999999991',
      ]);
      expect(findPathLeastHeatLoss(blocks, 'ultra')).toBe(71);
    });
  });
});
