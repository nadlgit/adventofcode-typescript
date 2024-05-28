import {
  type Outcome,
  type Shape,
  calcOutcomeStrategyScore,
  calcShapeStrategyScore,
  getOutcome,
  getPlayerShape,
} from './round.js';

describe('getOutcome()', () => {
  it.each<[Shape, Shape, Outcome]>([
    ['rock', 'rock', 'draw'],
    ['paper', 'paper', 'draw'],
    ['scissors', 'scissors', 'draw'],
    ['scissors', 'rock', 'win'],
    ['rock', 'paper', 'win'],
    ['paper', 'scissors', 'win'],
    ['rock', 'scissors', 'loss'],
    ['paper', 'rock', 'loss'],
    ['scissors', 'paper', 'loss'],
  ])('%s vs %s -> %s', (opponent, player, expected) => {
    expect(getOutcome(opponent, player)).toBe(expected);
  });
});

describe('getPlayerShape()', () => {
  it.each<[Shape, Outcome, Shape]>([
    ['rock', 'draw', 'rock'],
    ['paper', 'draw', 'paper'],
    ['scissors', 'draw', 'scissors'],
    ['rock', 'win', 'paper'],
    ['paper', 'win', 'scissors'],
    ['scissors', 'win', 'rock'],
    ['rock', 'loss', 'scissors'],
    ['paper', 'loss', 'rock'],
    ['scissors', 'loss', 'paper'],
  ])('%s for %s -> %s', (opponent, outcome, expected) => {
    expect(getPlayerShape(opponent, outcome)).toBe(expected);
  });
});

describe('calcShapeStrategyScore()', () => {
  it('handles example line 1', () => {
    expect(calcShapeStrategyScore('A Y')).toBe(8);
  });

  it('handles example line 2', () => {
    expect(calcShapeStrategyScore('B X')).toBe(1);
  });

  it('handles example line 3', () => {
    expect(calcShapeStrategyScore('C Z')).toBe(6);
  });
});

describe('calcOutcomeStrategyScore()', () => {
  it('handles example line 1', () => {
    expect(calcOutcomeStrategyScore('A Y')).toBe(4);
  });

  it('handles example line 2', () => {
    expect(calcOutcomeStrategyScore('B X')).toBe(1);
  });

  it('handles example line 3', () => {
    expect(calcOutcomeStrategyScore('C Z')).toBe(7);
  });
});
