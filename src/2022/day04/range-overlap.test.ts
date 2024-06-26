import { type Range, findRangesOverlap, parseRangePair } from './range-overlap.js';

describe('parseRangePair()', () => {
  it("parses '2-10,8-99'", () => {
    expect(parseRangePair('2-10,8-99')).toEqual([
      [2, 10],
      [8, 99],
    ]);
  });
});

describe('findRangesOverlap()', () => {
  it('given same range', () => {
    expect(findRangesOverlap([1, 3], [1, 3])).toEqual([1, 3]);
  });

  it('given no overlap', () => {
    const range1: Range = [1, 3];
    const range2: Range = [4, 6];
    const expected: [] = [];
    expect(findRangesOverlap(range1, range2)).toEqual(expected);
    expect(findRangesOverlap(range2, range1)).toEqual(expected);
  });

  it('given partial overlap', () => {
    const range1: Range = [1, 3];
    const range2: Range = [2, 4];
    const expected = [2, 3];
    expect(findRangesOverlap(range1, range2)).toEqual(expected);
    expect(findRangesOverlap(range2, range1)).toEqual(expected);
  });

  it('given 1 value overlap', () => {
    const range1: Range = [1, 3];
    const range2: Range = [3, 4];
    const expected = [3, 3];
    expect(findRangesOverlap(range1, range2)).toEqual(expected);
    expect(findRangesOverlap(range2, range1)).toEqual(expected);
  });

  it('given same range end', () => {
    const range1: Range = [1, 3];
    const range2: Range = [2, 3];
    const expected = [2, 3];
    expect(findRangesOverlap(range1, range2)).toEqual(expected);
    expect(findRangesOverlap(range2, range1)).toEqual(expected);
  });

  it('given same range start', () => {
    const range1: Range = [1, 3];
    const range2: Range = [1, 2];
    const expected = [1, 2];
    expect(findRangesOverlap(range1, range2)).toEqual(expected);
    expect(findRangesOverlap(range2, range1)).toEqual(expected);
  });

  it('given fully containing overlap', () => {
    const range1: Range = [1, 4];
    const range2: Range = [2, 3];
    const expected = [2, 3];
    expect(findRangesOverlap(range1, range2)).toEqual(expected);
    expect(findRangesOverlap(range2, range1)).toEqual(expected);
  });
});
