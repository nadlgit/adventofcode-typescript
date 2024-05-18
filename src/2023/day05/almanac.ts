type ResourceMapName =
  | 'seed-to-soil'
  | 'soil-to-fertilizer'
  | 'fertilizer-to-water'
  | 'water-to-light'
  | 'light-to-temperature'
  | 'temperature-to-humidity'
  | 'humidity-to-location';

export type Almanac = {
  seeds: number[];
} & Record<ResourceMapName, { source: number; destination: number; length: number }[]>;

export function parseAlmanac(lines: string[]): Almanac {
  function parseSeeds(lines: string[]): Almanac['seeds'] {
    return lines[0]
      .replace('seeds: ', '')
      .split(' ')
      .map((n) => Number.parseInt(n));
  }

  function parseResourceMap(lines: string[], mapName: ResourceMapName): Almanac[ResourceMapName] {
    const startIdx = lines.findIndex((line) => line.includes(mapName));
    const endIdx = lines.findIndex((line, idx) => idx > startIdx && !line);
    return lines.slice(startIdx + 1, endIdx === -1 ? undefined : endIdx).map((line) => {
      const [destination, source, length] = line.split(' ').map((n) => Number.parseInt(n));
      return { destination, source, length };
    });
  }

  return {
    seeds: parseSeeds(lines),
    'seed-to-soil': parseResourceMap(lines, 'seed-to-soil'),
    'soil-to-fertilizer': parseResourceMap(lines, 'soil-to-fertilizer'),
    'fertilizer-to-water': parseResourceMap(lines, 'fertilizer-to-water'),
    'water-to-light': parseResourceMap(lines, 'water-to-light'),
    'light-to-temperature': parseResourceMap(lines, 'light-to-temperature'),
    'temperature-to-humidity': parseResourceMap(lines, 'temperature-to-humidity'),
    'humidity-to-location': parseResourceMap(lines, 'humidity-to-location'),
  };
}

export function findDestination(source: number, resourceMap: Almanac[ResourceMapName]): number {
  for (const {
    source: mapRangeSrc,
    destination: mapRangeDst,
    length: mapRangeLen,
  } of resourceMap) {
    if (source >= mapRangeSrc && source < mapRangeSrc + mapRangeLen) {
      return source + mapRangeDst - mapRangeSrc;
    }
  }
  return source;
}

export function findSeedLocation(seed: number, almanacMaps: Omit<Almanac, 'seeds'>): number {
  const soil = findDestination(seed, almanacMaps['seed-to-soil']);
  const fertilizer = findDestination(soil, almanacMaps['soil-to-fertilizer']);
  const water = findDestination(fertilizer, almanacMaps['fertilizer-to-water']);
  const light = findDestination(water, almanacMaps['water-to-light']);
  const temperature = findDestination(light, almanacMaps['light-to-temperature']);
  const humidity = findDestination(temperature, almanacMaps['temperature-to-humidity']);
  const location = findDestination(humidity, almanacMaps['humidity-to-location']);
  return location;
}

export function seedsNumsToRanges(seeds: number[]): [number, number][] {
  const seedRanges: [number, number][] = [];
  for (let i = 0; i < seeds.length; i += 2) {
    seedRanges.push([seeds[i], seeds[i + 1]]);
  }
  return seedRanges;
}

export function findRangeDestinations(
  [sourceStart, sourceLength]: [number, number],
  resourceMap: Almanac[ResourceMapName]
): [number, number][] {
  function splitSourceRange(
    [start, length]: [number, number],
    [mapStart, mapLength]: [number, number]
  ): [number, number][] {
    const splitStarts = [start];
    if (start < mapStart && start + length > mapStart + 1) {
      splitStarts.push(mapStart);
    }
    if (start < mapStart + mapLength - 1 && start + length > mapStart + mapLength) {
      splitStarts.push(mapStart + mapLength);
    }
    const ranges = splitStarts.map<[number, number]>((splitStart, idx) => {
      const nextSplitStart = idx < splitStarts.length - 1 ? splitStarts[idx + 1] : start + length;
      return [splitStart, nextSplitStart - splitStart];
    });
    return ranges;
  }

  const mapRanges = resourceMap
    .map<[number, number]>(({ source, length }) => [source, length])
    .sort((a, b) => a[0] - b[0]);
  let sourceRanges: [number, number][] = [[sourceStart, sourceLength]];
  for (const [mapStart, mapLength] of mapRanges) {
    sourceRanges = sourceRanges.flatMap(([start, length]) =>
      splitSourceRange([start, length], [mapStart, mapLength])
    );
  }
  return sourceRanges.map(([start, length]) => [findDestination(start, resourceMap), length]);
}

export function findSeedRangesLocations(
  seedRanges: [number, number][],
  almanacMaps: Omit<Almanac, 'seeds'>
): [number, number][] {
  const soilRanges = seedRanges.flatMap((range) =>
    findRangeDestinations(range, almanacMaps['seed-to-soil'])
  );
  const fertilizerRanges = soilRanges.flatMap((range) =>
    findRangeDestinations(range, almanacMaps['soil-to-fertilizer'])
  );
  const waterRanges = fertilizerRanges.flatMap((range) =>
    findRangeDestinations(range, almanacMaps['fertilizer-to-water'])
  );
  const lightRanges = waterRanges.flatMap((range) =>
    findRangeDestinations(range, almanacMaps['water-to-light'])
  );
  const temperatureRanges = lightRanges.flatMap((range) =>
    findRangeDestinations(range, almanacMaps['light-to-temperature'])
  );
  const humidityRanges = temperatureRanges.flatMap((range) =>
    findRangeDestinations(range, almanacMaps['temperature-to-humidity'])
  );
  const locationRanges = humidityRanges.flatMap((range) =>
    findRangeDestinations(range, almanacMaps['humidity-to-location'])
  );
  return locationRanges;
}
