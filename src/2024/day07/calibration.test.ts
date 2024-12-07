import {
  checkCalibrationEquation,
  parseCalibrationEquations,
  type CalibrationEquation,
} from './calibration.js';

describe('parseCalibrationEquations()', () => {
  it('parse 1 line and ignore final empty lines', () => {
    const lines = ['21037: 9 7 18 13', '', ''];
    expect(parseCalibrationEquations(lines)).toEqual([
      { testValue: 21037, operands: [9, 7, 18, 13] },
    ]);
  });

  it('handle example', () => {
    const lines = [
      '190: 10 19',
      '3267: 81 40 27',
      '83: 17 5',
      '156: 15 6',
      '7290: 6 8 6 15',
      '161011: 16 10 13',
      '192: 17 8 14',
      '21037: 9 7 18 13',
      '292: 11 6 16 20',
    ];
    expect(parseCalibrationEquations(lines)).toEqual([
      { testValue: 190, operands: [10, 19] },
      { testValue: 3267, operands: [81, 40, 27] },
      { testValue: 83, operands: [17, 5] },
      { testValue: 156, operands: [15, 6] },
      { testValue: 7290, operands: [6, 8, 6, 15] },
      { testValue: 161011, operands: [16, 10, 13] },
      { testValue: 192, operands: [17, 8, 14] },
      { testValue: 21037, operands: [9, 7, 18, 13] },
      { testValue: 292, operands: [11, 6, 16, 20] },
    ]);
  });
});

describe('checkCalibrationEquation() with add and multiply operators', () => {
  const expectAccepted = (calibration: CalibrationEquation) => {
    expect(checkCalibrationEquation(calibration, false)).toBe(true);
  };
  const expectRejected = (calibration: CalibrationEquation) => {
    expect(checkCalibrationEquation(calibration, false)).toBe(false);
  };

  describe('handle example', () => {
    it.each([
      { testValue: 190, operands: [10, 19] },
      { testValue: 3267, operands: [81, 40, 27] },
      { testValue: 292, operands: [11, 6, 16, 20] },
    ])('accept $testValue vs $operands', ({ testValue, operands }) => {
      expectAccepted({ testValue, operands });
    });

    it.each([
      { testValue: 83, operands: [17, 5] },
      { testValue: 156, operands: [15, 6] },
      { testValue: 7290, operands: [6, 8, 6, 15] },
      { testValue: 161011, operands: [16, 10, 13] },
      { testValue: 192, operands: [17, 8, 14] },
      { testValue: 21037, operands: [9, 7, 18, 13] },
    ])('reject $testValue vs $operands', ({ testValue, operands }) => {
      expectRejected({ testValue, operands });
    });
  });
});

describe('checkCalibrationEquation() with add, multiply and concatenation operators', () => {
  const expectAccepted = (calibration: CalibrationEquation) => {
    expect(checkCalibrationEquation(calibration, true)).toBe(true);
  };
  const expectRejected = (calibration: CalibrationEquation) => {
    expect(checkCalibrationEquation(calibration, true)).toBe(false);
  };

  describe('handle example', () => {
    it.each([
      { testValue: 190, operands: [10, 19] },
      { testValue: 3267, operands: [81, 40, 27] },
      { testValue: 156, operands: [15, 6] },
      { testValue: 7290, operands: [6, 8, 6, 15] },
      { testValue: 192, operands: [17, 8, 14] },
      { testValue: 292, operands: [11, 6, 16, 20] },
    ])('accept $testValue vs $operands', ({ testValue, operands }) => {
      expectAccepted({ testValue, operands });
    });

    it.each([
      { testValue: 83, operands: [17, 5] },
      { testValue: 161011, operands: [16, 10, 13] },
      { testValue: 21037, operands: [9, 7, 18, 13] },
    ])('reject $testValue vs $operands', ({ testValue, operands }) => {
      expectRejected({ testValue, operands });
    });
  });
});
