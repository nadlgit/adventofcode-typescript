import { getInputLines, sum } from '#utils/index.js';
import {
  findGroupCommonItemType,
  findRucksackDuplicatedItemType,
  getItemPriority,
  getRucksacksGroups,
} from './rucksack.js';

export function solvePart1(filepath: string) {
  const rucksacks = getInputLines(filepath);
  const priorities = rucksacks.map((rucksack) =>
    getItemPriority(findRucksackDuplicatedItemType(rucksack))
  );
  return sum(priorities);
}

export function solvePart2(filepath: string) {
  const groups = getRucksacksGroups(getInputLines(filepath));
  const priorities = groups.map((group) => getItemPriority(findGroupCommonItemType(group)));
  return sum(priorities);
}
