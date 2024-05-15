export type CubeSet = { red?: number; green?: number; blue?: number };

export type Game = { id: number; sets: CubeSet[] };

export function parseGame(line: string): Game {
  const lineParts = line.replace(/ +/g, ' ').split(':');
  const id = parseInt(lineParts[0].replace('Game ', ''));
  const sets = lineParts[1].split(';').map((str) =>
    str.split(',').reduce<CubeSet>((acc, curr) => {
      const [count, color] = curr.trim().split(' ');
      acc[color as keyof CubeSet] = (acc[color as keyof CubeSet] ?? 0) + Number.parseInt(count);
      return acc;
    }, {})
  );
  return { id, sets };
}

export function isPossibleGame(game: Game, bag: CubeSet): boolean {
  return game.sets.every((cubeSet) =>
    Object.entries(cubeSet).every(([color, count]) => count <= (bag[color as keyof CubeSet] ?? 0))
  );
}

export function identifyGameMinCubeSet(game: Game): Required<CubeSet> {
  return game.sets.reduce<Required<CubeSet>>(
    (acc, { red, green, blue }) => ({
      red: Math.max(red ?? 0, acc.red),
      green: Math.max(green ?? 0, acc.green),
      blue: Math.max(blue ?? 0, acc.blue),
    }),
    { red: 0, green: 0, blue: 0 }
  );
}
