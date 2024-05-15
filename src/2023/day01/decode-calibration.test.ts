import { decodeCalibration, decodeSpelledCalibration } from './decode-calibration.js';

describe('decodeCalibration()', () => {
  it.each([
    { input: '1abc2', expected: 12 },
    { input: 'pqr3stu8vwx', expected: 38 },
    { input: 'a1b2c3d4e5f', expected: 15 },
    { input: 'treb7uchet', expected: 77 },
  ])('decodes $input as $expected', ({ input, expected }) => {
    expect(decodeCalibration(input)).toEqual(expected);
  });
});

describe('decodeSpelledCalibration()', () => {
  it.each([
    { input: 'two1nine', expected: 29 },
    { input: 'eightwothree', expected: 83 },
    { input: 'abcone2threexyz', expected: 13 },
    { input: 'xtwone3four', expected: 24 },
    { input: '4nineeightseven2', expected: 42 },
    { input: 'zoneight234', expected: 14 },
    { input: '7pqrstsixteen', expected: 76 },
    // Cases from Reddit tip
    { input: 'eighthree', expected: 83 },
    { input: 'sevenine', expected: 79 },
    { input: 'oneighthree', expected: 13 },
  ])('decodes $input as $expected', ({ input, expected }) => {
    expect(decodeSpelledCalibration(input)).toEqual(expected);
  });
});
