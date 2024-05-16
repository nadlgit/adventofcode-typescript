import { EngineSchematic, parseSchematicLine } from './engine.js';

describe('parseSchematicLine()', () => {
  it('parses numbers', () => {
    const line = '12.g34#.*567.89';
    const result = parseSchematicLine(line);
    expect(result.numbers).toIncludeSameMembers([
      { value: 12, startIdx: 0, endIdx: 1 },
      { value: 34, startIdx: 4, endIdx: 5 },
      { value: 567, startIdx: 9, endIdx: 11 },
      { value: 89, startIdx: 13, endIdx: 14 },
    ]);
  });

  it('parses symbols', () => {
    const line = '12.g34#.*567.89';
    const result = parseSchematicLine(line);
    expect(result.symbols).toIncludeSameMembers([
      { value: '#', idx: 6 },
      { value: '*', idx: 8 },
    ]);
  });
});

describe('EngineSchematic.getPartNumbers()', () => {
  const execTestCase = (schematic: string[], expected: number[]) => {
    expect(new EngineSchematic(schematic).getPartNumbers()).toIncludeSameMembers(expected);
  };

  describe('selects number given adjacent symbol', () => {
    it.each<{ case: string; schematic: string[] }>([
      {
        case: 'on left',
        //prettier-ignore
        schematic: [
          '.......',
          '.45*...',
          '.......',
        ],
      },
      {
        case: 'on right',
        //prettier-ignore
        schematic: [
          '.......',
          '...*45.',
          '.......',
        ],
      },
      {
        case: 'on top',
        //prettier-ignore
        schematic: [
          '..45...',
          '...*...',
          '.......',
        ],
      },
      {
        case: 'on bottom',
        //prettier-ignore
        schematic: [
          '.......',
          '...*...',
          '..45...',
        ],
      },
      {
        case: 'on bottom left',
        //prettier-ignore
        schematic: [
          '.......',
          '...*...',
          '.45....',
        ],
      },
      {
        case: 'on bottom right',
        //prettier-ignore
        schematic: [
          '.......',
          '...*...',
          '....45.',
        ],
      },
      {
        case: 'on top right',
        //prettier-ignore
        schematic: [
          '....45.',
          '...*...',
          '.......',
        ],
      },
      {
        case: 'on top left',
        //prettier-ignore
        schematic: [
          '.45....',
          '...*...',
          '.......',
        ],
      },
    ])('$case', ({ schematic }) => {
      execTestCase(schematic, [45]);
    });
  });

  describe('ignores number given adjacent character not symbol', () => {
    it.each<{ case: string; character: string }>([
      {
        case: 'number',
        character: '1',
      },
      {
        case: 'letter',
        character: 'A',
      },
      {
        case: 'point',
        character: '.',
      },
    ])('$case', ({ character }) => {
      //prettier-ignore
      const schematic = [
        '..*..'.replace('*', character),
        '.45..',
      ]
      execTestCase(schematic, []);
    });
  });

  it('handles example', () => {
    const schematic = [
      '467..114..',
      '...*......',
      '..35..633.',
      '......#...',
      '617*......',
      '.....+.58.',
      '..592.....',
      '......755.',
      '...$.*....',
      '.664.598..',
    ];
    execTestCase(schematic, [467, 35, 633, 617, 592, 755, 664, 598]);
  });
});

describe('EngineSchematic.getGearRatios()', () => {
  const execTestCase = (schematic: string[], expected: number[]) => {
    expect(new EngineSchematic(schematic).getGearRatios()).toIncludeSameMembers(expected);
  };

  it('returns adjacent part numbers product', () => {
    //prettier-ignore
    const schematic = [
      '.9..',
      '..*.',
      '11..',
    ]
    execTestCase(schematic, [99]);
  });

  describe('ignores', () => {
    it.each<{ case: string; schematic: string[] }>([
      {
        case: 'symbol not star character',
        //prettier-ignore
        schematic: [
          '.9..',
          '..#.',
          '11..',
        ],
      },
      {
        case: 'less than 2 adjacent part numbers',
        //prettier-ignore
        schematic: [
          '.9..',
          '..*.',
          '....',
        ],
      },
      {
        case: 'more than 2 adjacent part numbers',
        //prettier-ignore
        schematic: [
          '.9.2',
          '..*.',
          '11..',
        ],
      },
    ])('$case', ({ schematic }) => {
      execTestCase(schematic, []);
    });
  });

  it('handles example', () => {
    const schematic = [
      '467..114..',
      '...*......',
      '..35..633.',
      '......#...',
      '617*......',
      '.....+.58.',
      '..592.....',
      '......755.',
      '...$.*....',
      '.664.598..',
    ];
    execTestCase(schematic, [16345, 451490]);
  });
});
