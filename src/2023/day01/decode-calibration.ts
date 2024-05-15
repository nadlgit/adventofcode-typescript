export function decodeCalibration(input: string) {
  const digits = input.replace(/[^\d]/g, '');
  const strValue = digits[0] + digits[digits.length - 1];
  return Number.parseInt(strValue);
}

export function decodeSpelledCalibration(input: string) {
  const mapping = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
  };
  const regex = new RegExp(Object.keys(mapping).join('|'), 'g');
  let translated = input;
  while (regex.test(translated)) {
    translated = translated.replace(
      regex,
      (match) => match[0] + mapping[match as keyof typeof mapping] + match[match.length - 1]
    );
  }
  return decodeCalibration(translated);
}
