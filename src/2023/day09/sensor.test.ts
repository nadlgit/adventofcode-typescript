import { extrapolateNextValue, extrapolatePrevValue } from './sensor.js';

describe('extrapolateNextValue()', () => {
  it('handles example sequence 1', () => {
    expect(extrapolateNextValue([0, 3, 6, 9, 12, 15])).toBe(18);
  });

  it('handles example sequence 2', () => {
    expect(extrapolateNextValue([1, 3, 6, 10, 15, 21])).toBe(28);
  });

  it('handles example sequence 3', () => {
    expect(extrapolateNextValue([10, 13, 16, 21, 30, 45])).toBe(68);
  });
});

describe('extrapolatePrevValue()', () => {
  it('handles example sequence 1', () => {
    expect(extrapolatePrevValue([0, 3, 6, 9, 12, 15])).toBe(-3);
  });

  it('handles example sequence 2', () => {
    expect(extrapolatePrevValue([1, 3, 6, 10, 15, 21])).toBe(0);
  });

  it('handles example sequence 3', () => {
    expect(extrapolatePrevValue([10, 13, 16, 21, 30, 45])).toBe(5);
  });
});
