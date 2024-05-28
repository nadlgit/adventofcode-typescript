type Reflection = { type: 'horizontal' | 'vertical'; value: number };

export function parsePatterns(lines: string[]): string[][] {
  const patterns: string[][] = [[]];
  let currentPattern: string[] = patterns[0];
  for (const line of lines) {
    if (line) {
      currentPattern.push(line);
    } else {
      currentPattern = [];
      patterns.push(currentPattern);
    }
  }
  return patterns;
}

export function countLineReflectionColsLeft(line: string): Set<number> {
  const subStringStart = (str: string, len: number) => str.substring(0, len);
  const subStringEnd = (str: string, len: number) => str.substring(str.length - len);
  const counts = new Set<number>();
  const reversedLine = line.split('').reverse().join('');
  for (let length = 2; length <= line.length; length += 2) {
    if (subStringStart(line, length) === subStringEnd(reversedLine, length)) {
      counts.add(length / 2);
    }
    if (subStringEnd(line, length) === subStringStart(reversedLine, length)) {
      counts.add(line.length - length / 2);
    }
  }
  return counts;
}

export function findPatternReflections(pattern: string[]): Reflection[] {
  const reflections: Reflection[] = [];

  const verticals = pattern.map((line) => countLineReflectionColsLeft(line));
  for (const n of verticals[0]) {
    if (verticals.every((v) => v.has(n))) {
      reflections.push({ type: 'vertical', value: n });
    }
  }

  const columns = pattern.reduce<string[]>((acc, line) => {
    for (let i = 0; i < acc.length; i++) {
      acc[i] += line[i];
    }
    return acc;
  }, new Array(pattern.length > 0 ? pattern[0].length : 0).fill(''));
  const horizontals = columns.map((line) => countLineReflectionColsLeft(line));
  for (const n of horizontals[0]) {
    if (horizontals.every((h) => h.has(n))) {
      reflections.push({ type: 'horizontal', value: n });
    }
  }

  return reflections;
}

export function calcReflectionSummary({ type, value }: Reflection): number {
  return value * (type === 'horizontal' ? 100 : 1);
}

export function calcPatternSummary(pattern: string[]): number {
  const reflections = findPatternReflections(pattern);
  if (reflections.length !== 1) {
    return 0;
  }
  return calcReflectionSummary(reflections[0]);
}

export function calcFixedPatternSummary(pattern: string[]): number {
  const initialReflections = findPatternReflections(pattern);
  if (initialReflections.length !== 1) {
    return 0;
  }
  const unfixedReflection = initialReflections[0];
  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[0].length; c++) {
      const newPattern = pattern.map((line, rIdx) =>
        line
          .split('')
          .map((elt, cIdx) => (rIdx === r && cIdx === c ? (elt === '#' ? '.' : '#') : elt))
          .join('')
      );
      const newReflections = findPatternReflections(newPattern).filter(
        ({ type, value }) => type !== unfixedReflection.type || value !== unfixedReflection.value
      );
      if (newReflections.length === 1) {
        return calcReflectionSummary(newReflections[0]);
      }
    }
  }
  return 0;
}
