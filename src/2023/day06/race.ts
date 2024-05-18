type Race = { time: number; bestDistance: number };

export function parseRaces(lines: string[]): Race[] {
  const [times, distances] = lines.map((line) => {
    const [, numsPart] = line.split(':');
    return numsPart
      .trim()
      .split(/ +/)
      .map((str) => Number.parseInt(str));
  });
  const races: Race[] = [];
  for (let i = 0; i < times.length; i++) {
    races.push({ time: times[i], bestDistance: distances[i] });
  }
  return races;
}

export function parseUniqueRace(lines: string[]): Race {
  const [time, bestDistance] = lines.map((line) => {
    const [, numsPart] = line.split(':');
    return Number.parseInt(numsPart.replace(/ +/g, ''));
  });
  return { time, bestDistance };
}

export function countWinningWays({ time, bestDistance }: Race): number {
  // Given: t is race time, d is best distance and x is hold time
  // Equation is: x² - tx + d < 0, with 0 < x < t
  const discriminant = time ** 2 - 4 * bestDistance;
  const solutions = [(time - Math.sqrt(discriminant)) / 2, (time + Math.sqrt(discriminant)) / 2];
  const holdTimeMin = Math.floor(Math.min(...solutions)) + 1;
  const holdTimeMax = Math.ceil(Math.max(...solutions)) - 1;
  return holdTimeMax >= holdTimeMin ? holdTimeMax - holdTimeMin + 1 : 0;
}
