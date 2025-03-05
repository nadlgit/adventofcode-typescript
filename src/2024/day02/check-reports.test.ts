import { isSafeReport } from './check-reports.js';

describe('isSafeReport() with allowBadLevel = false', () => {
  const expectAccepted = (report: number[]) => {
    expect(isSafeReport(report, false)).toBe(true);
  };
  const expectRejected = (report: number[]) => {
    expect(isSafeReport(report, false)).toBe(false);
  };

  it('accept when levels all increasing', () => {
    expectAccepted([1, 2, 3]);
  });

  it('accept when levels all decreasing', () => {
    expectAccepted([3, 2, 1]);
  });

  it('reject when levels not all increasing or decreasing', () => {
    expectRejected([1, 3, 2]);
  });

  it('reject when all increasing and adjacent levels differ by less than 1', () => {
    expectRejected([1, 1, 2]);
  });

  it('reject when all decreasing and adjacent levels differ by less than 1', () => {
    expectRejected([2, 1, 1]);
  });

  it('reject when all increasing and adjacent levels differ by more than 3', () => {
    expectRejected([1, 2, 6]);
  });

  it('reject when all decreasing and adjacent levels differ by more than 3', () => {
    expectRejected([6, 2, 1]);
  });

  it.each([
    [[7, 6, 4, 2, 1], true],
    [[1, 2, 7, 8, 9], false],
    [[9, 7, 6, 2, 1], false],
    [[1, 3, 2, 4, 5], false],
    [[8, 6, 4, 4, 1], false],
    [[1, 3, 6, 7, 9], true],
  ])('handle example %o', (report, expected) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expected ? expectAccepted(report) : expectRejected(report);
  });
});

describe('isSafeReport() with allowBadLevel = true', () => {
  const expectAccepted = (report: number[]) => {
    expect(isSafeReport(report, true)).toBe(true);
  };
  const expectRejected = (report: number[]) => {
    expect(isSafeReport(report, true)).toBe(false);
  };

  it.each([[[1, 3, 2]], [[1, 1, 2]], [[6, 2, 1]]])('accept %o', (report) => {
    expectAccepted(report);
  });

  it.each([[[1, 3, 2, 2]], [[1, 5, 9]]])('reject %o', (report) => {
    expectRejected(report);
  });

  it.each([
    [[7, 6, 4, 2, 1], true],
    [[1, 2, 7, 8, 9], false],
    [[9, 7, 6, 2, 1], false],
    [[1, 3, 2, 4, 5], true],
    [[8, 6, 4, 4, 1], true],
    [[1, 3, 6, 7, 9], true],
  ])('handle example %o', (report, expected) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expected ? expectAccepted(report) : expectRejected(report);
  });
});
