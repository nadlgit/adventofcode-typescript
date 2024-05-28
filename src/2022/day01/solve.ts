import { getInputLines, sum } from '#utils/index.js';

export function solvePart1(filepath: string) {
  const elvesFood = parseElvesFoodInventory(getInputLines(filepath));
  const totals = elvesFood.map((inventory) => sum(inventory));
  return Math.max(...totals);
}

export function solvePart2(filepath: string) {
  const elvesFood = parseElvesFoodInventory(getInputLines(filepath));
  const sortedTotals = elvesFood.map((inventory) => sum(inventory)).sort((a, b) => b - a);
  return sum(sortedTotals.slice(0, 3));
}

type FoodCalories = number[];

function parseElvesFoodInventory(lines: string[]): FoodCalories[] {
  const elvesInventory: FoodCalories[] = [[]];
  let currentElf: FoodCalories = elvesInventory[0];
  for (const line of lines) {
    if (line) {
      currentElf.push(Number.parseInt(line));
    } else {
      currentElf = [];
      elvesInventory.push(currentElf);
    }
  }
  return elvesInventory;
}
