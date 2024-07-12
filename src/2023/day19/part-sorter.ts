export type RateCategory = 'x' | 'm' | 'a' | 's';

export type ConditionOperator = '<' | '>';

export type WorkflowRule = Readonly<{
  condition?: {
    category: RateCategory;
    operator: ConditionOperator;
    value: number;
  };
  destination: string;
}>;

export type WorkflowMap = Record<string, WorkflowRule[]>;

export type PartRating = Readonly<Record<RateCategory, number>>;

export type PartRatingRange = Readonly<Record<RateCategory, [number, number]>>;

export function parseWorkflow(line: string): { name: string; rules: WorkflowRule[] } {
  const [name, rulesStr] = line.replace('}', '').split('{');
  const rules = rulesStr.split(',').map((rule) => {
    const [ruleLeft, ruleRight] = rule.split(':');
    if (!ruleRight) {
      return { destination: ruleLeft };
    }
    const destination = ruleRight;
    const category = ruleLeft[0] as RateCategory;
    const operator = ruleLeft[1] as ConditionOperator;
    const value = Number.parseInt(ruleLeft.substring(2));
    return { condition: { category, operator, value }, destination };
  });
  return { name, rules };
}

export function parsePartRating(line: string): PartRating {
  return line
    .replace(/[{}]/g, '')
    .split(',')
    .reduce<PartRating>((acc, str) => ({ ...acc, [str[0]]: Number.parseInt(str.substring(2)) }), {
      x: -1,
      m: -1,
      a: -1,
      s: -1,
    });
}

export function parseInput(lines: string[]): { workflows: WorkflowMap; parts: PartRating[] } {
  const emptyLineIdx = lines.findIndex((line) => line === '');
  const workflows = lines
    .slice(0, emptyLineIdx)
    .map((line) => parseWorkflow(line))
    .reduce<WorkflowMap>((acc, { name, rules }) => ({ ...acc, [name]: rules }), {});
  const parts = lines.slice(emptyLineIdx + 1).map((line) => parsePartRating(line));
  return { workflows, parts };
}

export function applyWorkflow(rules: WorkflowRule[], part: PartRating): string {
  for (const { condition, destination } of rules) {
    if (
      !condition ||
      {
        '<': part[condition.category] < condition.value,
        '>': part[condition.category] > condition.value,
      }[condition.operator]
    ) {
      return destination;
    }
  }
  return '';
}

export function processPart(workflows: WorkflowMap, part: PartRating): 'A' | 'R' {
  let destination = 'in';
  while (destination !== 'A' && destination !== 'R') {
    destination = applyWorkflow(workflows[destination], part);
  }
  return destination;
}

export function splitRangeByCondition(
  [start, end]: [number, number],
  comparator: '<' | '<=' | '>' | '>=',
  value: number
): { valid: [number, number] | null; invalid: [number, number] | null } {
  switch (comparator) {
    case '<':
      if (value <= start) return { valid: null, invalid: [start, end] };
      if (value > end) return { valid: [start, end], invalid: null };
      return { valid: [start, value - 1], invalid: [value, end] };
    case '<=':
      if (value < start) return { valid: null, invalid: [start, end] };
      if (value >= end) return { valid: [start, end], invalid: null };
      return { valid: [start, value], invalid: [value + 1, end] };
    case '>':
      if (value < start) return { valid: [start, end], invalid: null };
      if (value >= end) return { valid: null, invalid: [start, end] };
      return { valid: [value + 1, end], invalid: [start, value] };
    case '>=':
      if (value <= start) return { valid: [start, end], invalid: null };
      if (value > end) return { valid: null, invalid: [start, end] };
      return { valid: [value, end], invalid: [start, value - 1] };
  }
}

export function rangeApplyWorkflow(
  rules: WorkflowRule[],
  range: PartRatingRange
): { destination: string; range: PartRatingRange }[] {
  const resultList: { destination: string; range: PartRatingRange }[] = [];
  let currentRange = range;
  for (const { condition, destination } of rules) {
    if (!condition) {
      resultList.push({ destination, range: currentRange });
      break;
    }
    const { category, operator, value } = condition;
    const { valid, invalid } = splitRangeByCondition(currentRange[category], operator, value);
    if (valid) {
      resultList.push({ destination, range: { ...currentRange, [category]: valid } });
    }
    if (invalid) {
      currentRange = { ...currentRange, [category]: invalid };
    } else {
      break;
    }
  }
  return resultList;
}

export function processPossibleRanges(
  workflows: WorkflowMap
): Record<'A' | 'R', PartRatingRange[]> {
  const resultMap: Record<'A' | 'R', PartRatingRange[]> = { A: [], R: [] };
  const queue: { destination: string; range: PartRatingRange }[] = [
    { destination: 'in', range: { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] } },
  ];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const { destination, range } of rangeApplyWorkflow(
      workflows[current.destination],
      current.range
    )) {
      if (destination === 'A' || destination === 'R') {
        resultMap[destination].push(range);
      } else {
        queue.push({ destination, range });
      }
    }
  }
  return resultMap;
}
