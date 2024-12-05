import { getInputLines, sum } from '#utils/index.js';
import {
  findOrderedUpdatesMiddlePage,
  findReorderedUpdatesMiddlePage,
  parseOrderingRules,
  parseUpdates,
} from './print-queue.js';

export function solvePart1(filepath: string) {
  const lines = getInputLines(filepath);
  const orderingRules = parseOrderingRules(lines);
  const updates = parseUpdates(lines);
  return sum(findOrderedUpdatesMiddlePage(updates, orderingRules));
}

export function solvePart2(filepath: string) {
  const lines = getInputLines(filepath);
  const orderingRules = parseOrderingRules(lines);
  const updates = parseUpdates(lines);
  return sum(findReorderedUpdatesMiddlePage(updates, orderingRules));
}
