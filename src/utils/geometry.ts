export function manhattanDistance([x1, y1]: [number, number], [x2, y2]: [number, number]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export function shoelaceArea(sortedVertices: [number, number][]) {
  // https://en.wikipedia.org/wiki/Shoelace_formula
  return Math.abs(
    sortedVertices.reduce((acc, [row, col], idx) => {
      const nextIdx = idx < sortedVertices.length - 1 ? idx + 1 : 0;
      const [nextRow, nextCol] = sortedVertices[nextIdx];
      return acc + row * nextCol - col * nextRow;
    }, 0) / 2
  );
}

export type AdjacentPosition = {
  direction: 'left' | 'right' | 'up' | 'down' | 'upleft' | 'upright' | 'downleft' | 'downright';
  row: number;
  col: number;
};
export function getAdjacentPositions({
  row,
  col,
  filter,
}: {
  row: number;
  col: number;
  filter?: { rowMin: number; rowMax: number; colMin: number; colMax: number };
}): AdjacentPosition[] {
  const allPositions: AdjacentPosition[] = [
    { direction: 'left', row, col: col - 1 },
    { direction: 'right', row, col: col + 1 },
    { direction: 'up', row: row - 1, col },
    { direction: 'down', row: row + 1, col },
    { direction: 'upleft', row: row - 1, col: col - 1 },
    { direction: 'upright', row: row - 1, col: col + 1 },
    { direction: 'downleft', row: row + 1, col: col - 1 },
    { direction: 'downright', row: row + 1, col: col + 1 },
  ];
  return filter
    ? allPositions.filter(
        ({ row, col }) =>
          row >= filter.rowMin &&
          row <= filter.rowMax &&
          col >= filter.colMin &&
          col <= filter.colMax
      )
    : allPositions;
}

export function translateDimension(value: number, size: number): number {
  return value >= 0 ? value % size : value - size * Math.floor(value / size);
}
