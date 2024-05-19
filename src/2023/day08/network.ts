type Direction = 'L' | 'R';

type NetworkNode = { name: string; nextNodes: Record<Direction, string> };

export type Map = {
  instructions: Direction[];
  network: Record<NetworkNode['name'], NetworkNode['nextNodes']>;
};

export function parseMap(lines: string[]): Map {
  const instructions = lines[0].split('') as Direction[];

  const network = lines.slice(2).reduce<Map['network']>((acc, line) => {
    const [name, L, R] = line.match(/\w+/g) ?? ['', '', ''];
    acc[name] = { L, R };
    return acc;
  }, {});

  return { instructions, network };
}

export function identifyNextDirection(
  instructions: Map['instructions'],
  prevStepsCount: number
): Direction {
  return instructions[prevStepsCount % instructions.length];
}

export function countNavigationSteps(
  map: Map,
  from: NetworkNode['name'],
  to?: NetworkNode['name']
): number {
  let current = from;
  let count = 0;
  const endNodes = Object.keys(map.network).filter((node) => node.endsWith('Z'));
  while (to ? current !== to : !endNodes.includes(current)) {
    current = map.network[current][identifyNextDirection(map.instructions, count)];
    count++;
  }
  return count;
}

export function getStartNodes(map: Map): NetworkNode['name'][] {
  return Object.keys(map.network).filter((node) => node.endsWith('A'));
}
