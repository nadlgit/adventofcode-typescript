import { countNavigationSteps, identifyNextDirection, parseMap } from './network.js';

describe('parseMap()', () => {
  it('handles example', () => {
    //prettier-ignore
    const lines = [
      'LLR',
      '',
      'AAA = (BBB, BBB)',
      'BBB = (AAA, ZZZ)',
      'ZZZ = (ZZZ, ZZZ)',
    ];
    expect(parseMap(lines)).toEqual({
      instructions: ['L', 'L', 'R'],
      network: {
        AAA: { L: 'BBB', R: 'BBB' },
        BBB: { L: 'AAA', R: 'ZZZ' },
        ZZZ: { L: 'ZZZ', R: 'ZZZ' },
      },
    });
  });
});

describe('identifyNextDirection()', () => {
  it('given count is less then instructions size', () => {
    expect(identifyNextDirection(['R', 'L'], 0)).toBe('R');
    expect(identifyNextDirection(['R', 'L'], 1)).toBe('L');
  });

  it('given count is greater then instructions size', () => {
    expect(identifyNextDirection(['R', 'L'], 2)).toBe('R');
    expect(identifyNextDirection(['R', 'L'], 3)).toBe('L');
  });
});

describe('countNavigationSteps()', () => {
  it('handles base example 1', () => {
    expect(
      countNavigationSteps(
        {
          instructions: ['R', 'L'],
          network: {
            AAA: { L: 'BBB', R: 'CCC' },
            BBB: { L: 'DDD', R: 'EEE' },
            CCC: { L: 'ZZZ', R: 'GGG' },
            DDD: { L: 'DDD', R: 'DDD' },
            EEE: { L: 'EEE', R: 'EEE' },
            GGG: { L: 'GGG', R: 'GGG' },
            ZZZ: { L: 'ZZZ', R: 'ZZZ' },
          },
        },
        'AAA',
        'ZZZ'
      )
    ).toBe(2);
  });

  it('handles base example 2', () => {
    expect(
      countNavigationSteps(
        {
          instructions: ['L', 'L', 'R'],
          network: {
            AAA: { L: 'BBB', R: 'BBB' },
            BBB: { L: 'AAA', R: 'ZZZ' },
            ZZZ: { L: 'ZZZ', R: 'ZZZ' },
          },
        },
        'AAA',
        'ZZZ'
      )
    ).toBe(6);
  });

  it('handles ghost example path 1', () => {
    expect(
      countNavigationSteps(
        {
          instructions: ['L', 'R'],
          network: {
            '11A': { L: '11B', R: 'XXX' },
            '11B': { L: 'XXX', R: '11Z' },
            '11Z': { L: '11B', R: 'XXX' },
            '22A': { L: '22B', R: 'XXX' },
            '22B': { L: '22C', R: '22C' },
            '22C': { L: '22Z', R: '22Z' },
            '22Z': { L: '22B', R: '22B' },
            XXX: { L: 'XXX', R: 'XXX' },
          },
        },
        '11A'
      )
    ).toBe(2);
  });

  it('handles ghost example path 2', () => {
    expect(
      countNavigationSteps(
        {
          instructions: ['L', 'R'],
          network: {
            '11A': { L: '11B', R: 'XXX' },
            '11B': { L: 'XXX', R: '11Z' },
            '11Z': { L: '11B', R: 'XXX' },
            '22A': { L: '22B', R: 'XXX' },
            '22B': { L: '22C', R: '22C' },
            '22C': { L: '22Z', R: '22Z' },
            '22Z': { L: '22B', R: '22B' },
            XXX: { L: 'XXX', R: 'XXX' },
          },
        },
        '22A'
      )
    ).toBe(3);
  });
});
