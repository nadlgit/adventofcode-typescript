type OrderingRule = [number, number];
type Update = number[];

export function parseOrderingRules(lines: string[]): OrderingRule[] {
  return lines
    .filter((line) => line.includes('|'))
    .map((line) => line.split('|').map((n) => Number.parseInt(n)) as OrderingRule);
}

export function parseUpdates(lines: string[]): Update[] {
  return lines
    .filter((line) => line.includes(','))
    .map((line) => line.split(',').map((n) => Number.parseInt(n)));
}

export function isUpdateOrdered(update: Update, orderingRules: OrderingRule[]): boolean {
  return orderingRules.every(
    ([before, after]) =>
      !update.includes(before) ||
      !update.includes(after) ||
      update.indexOf(before) < update.indexOf(after)
  );
}

export function reorderUpdate(update: Update, orderingRules: OrderingRule[]): Update {
  return [...update].sort((a, b) => (isUpdateOrdered([a, b], orderingRules) ? -1 : 1));
}

function findUpdateMiddlePage(update: Update) {
  return update[Math.floor(update.length / 2)];
}

export function findOrderedUpdatesMiddlePage(
  updates: Update[],
  orderingRules: OrderingRule[]
): number[] {
  return updates
    .filter((update) => isUpdateOrdered(update, orderingRules))
    .map(findUpdateMiddlePage);
}

export function findReorderedUpdatesMiddlePage(
  updates: Update[],
  orderingRules: OrderingRule[]
): number[] {
  return updates
    .filter((update) => !isUpdateOrdered(update, orderingRules))
    .map((update) => reorderUpdate(update, orderingRules))
    .map(findUpdateMiddlePage);
}
