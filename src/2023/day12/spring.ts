import { memoize } from '#utils/index.js';

type SpringsConditionRecord = {
  springs: string;
  damagedGroups: number[];
};

export function parseRecord(line: string): SpringsConditionRecord {
  const [springs, damagedPart] = line.split(' ');
  const damagedGroups = damagedPart.split(',').map((n) => Number.parseInt(n));
  return { springs, damagedGroups };
}

export const countDamagedArrangements = memoize(
  ({ springs, damagedGroups }: SpringsConditionRecord): number => {
    if (damagedGroups.length === 0) {
      return springs.includes('#') ? 0 : 1;
    }
    if (damagedGroups.length > 0 && springs.length === 0) {
      return 0;
    }
    switch (springs[0]) {
      case '.':
        return countDamagedArrangements({ springs: springs.substring(1), damagedGroups });
      case '#': {
        const springGroup = springs.substring(0, damagedGroups[0]);
        if (
          springGroup.length !== damagedGroups[0] ||
          springGroup.includes('.') ||
          springs[springGroup.length] === '#'
        ) {
          return 0;
        }
        return countDamagedArrangements({
          springs: springs.substring(damagedGroups[0] + 1),
          damagedGroups: damagedGroups.slice(1),
        });
      }
      case '?':
        return (
          countDamagedArrangements({ springs: '.' + springs.substring(1), damagedGroups }) +
          countDamagedArrangements({ springs: '#' + springs.substring(1), damagedGroups })
        );
      default:
        return 0;
    }
  }
);

export function unfoldRecord(line: string): string {
  const [springsPart, damagedPart] = line.split(' ');
  return (
    springsPart + ('?' + springsPart).repeat(4) + ' ' + damagedPart + (',' + damagedPart).repeat(4)
  );
}

export function countRecordArrangements(line: string): number {
  const { springs, damagedGroups } = parseRecord(line);
  return countDamagedArrangements({ springs, damagedGroups });
}

export function countUnfoldRecordArrangements(line: string): number {
  const { springs, damagedGroups } = parseRecord(unfoldRecord(line));
  return countDamagedArrangements({ springs, damagedGroups });
}
