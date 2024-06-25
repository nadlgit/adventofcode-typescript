export function findRucksackDuplicatedItemType(rucksack: string): string {
  const compartmentLength = rucksack.length / 2;
  const compartment1 = rucksack.substring(0, compartmentLength);
  const compartment2 = rucksack.substring(compartmentLength);
  for (const item of compartment1) {
    if (compartment2.includes(item)) return item;
  }
  return '';
}

export function getItemPriority(item: string): number {
  if (item >= 'a' && item <= 'z') return 1 + item.charCodeAt(0) - 'a'.charCodeAt(0);
  if (item >= 'A' && item <= 'Z') return 27 + item.charCodeAt(0) - 'A'.charCodeAt(0);
  return 0;
}

export function findGroupCommonItemType([rucksack1, rucksack2, rucksack3]: [
  string,
  string,
  string
]): string {
  for (const item of rucksack1) {
    if (rucksack2.includes(item) && rucksack3.includes(item)) return item;
  }
  return '';
}

export function getRucksacksGroups(rucksacks: string[]): [string, string, string][] {
  const groups: [string, string, string][] = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    groups.push([rucksacks[i], rucksacks[i + 1], rucksacks[i + 2]]);
  }
  return groups;
}
