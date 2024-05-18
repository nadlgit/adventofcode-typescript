import { getInputLines } from '#utils/index.js';
import {
  findSeedLocation,
  findSeedRangesLocations,
  parseAlmanac,
  seedsNumsToRanges,
} from './almanac.js';

export function solvePart1(filepath: string) {
  const almanac = parseAlmanac(getInputLines(filepath));
  const locations = almanac.seeds.map((seed) => findSeedLocation(seed, almanac));
  return Math.min(...locations);
}

export function solvePart2(filepath: string) {
  const almanac = parseAlmanac(getInputLines(filepath));
  const seedRanges = seedsNumsToRanges(almanac.seeds);
  const locationRanges = findSeedRangesLocations(seedRanges, almanac);
  return Math.min(...locationRanges.map(([start, _]) => start));
}
