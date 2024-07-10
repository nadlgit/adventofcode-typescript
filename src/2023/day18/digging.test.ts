import { calcLagoonVolume, parseCorrectInstruction, parseInstruction } from './digging.js';

describe('parseInstruction()', () => {
  it.each([
    ['L 1 (#70c710)', 1, 'left'],
    ['R 8 (#0dc571)', 8, 'right'],
    ['U 13 (#8ceee2)', 13, 'up'],
    ['D 620 (#caa173)', 620, 'down'],
  ])("decodes '%s' as %i meter(s) %s", (line, distance, direction) => {
    expect(parseInstruction(line)).toEqual({ direction, distance });
  });
});

describe('parseCorrectInstruction()', () => {
  it.each([
    ['L 1 (#70c710)', 461937, 'right'],
    ['R 8 (#0dc571)', 56407, 'down'],
    ['U 13 (#8ceee2)', 577262, 'left'],
    ['D 620 (#caa173)', 829975, 'up'],
  ])("decodes '%s' as %i meter(s) %s", (line, distance, direction) => {
    expect(parseCorrectInstruction(line)).toEqual({ direction, distance });
  });
});

describe('calcLagoonVolume()', () => {
  it('handles simple case', () => {
    expect(
      calcLagoonVolume([
        { direction: 'right', distance: 3 },
        { direction: 'down', distance: 2 },
        { direction: 'left', distance: 3 },
        { direction: 'up', distance: 2 },
      ])
    ).toBe(12);
  });

  it('handles example', () => {
    expect(
      calcLagoonVolume([
        { direction: 'right', distance: 6 },
        { direction: 'down', distance: 5 },
        { direction: 'left', distance: 2 },
        { direction: 'down', distance: 2 },
        { direction: 'right', distance: 2 },
        { direction: 'down', distance: 2 },
        { direction: 'left', distance: 5 },
        { direction: 'up', distance: 2 },
        { direction: 'left', distance: 1 },
        { direction: 'up', distance: 2 },
        { direction: 'right', distance: 2 },
        { direction: 'up', distance: 3 },
        { direction: 'left', distance: 2 },
        { direction: 'up', distance: 2 },
      ])
    ).toBe(62);
  });
});
