export type Shape = 'rock' | 'paper' | 'scissors';
export type Outcome = 'win' | 'loss' | 'draw';

const defeatsMapping: Record<Shape, Shape> = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const defeatedByMapping: Record<Shape, Shape> = {
  rock: 'paper',
  paper: 'scissors',
  scissors: 'rock',
};
const scoreShapeMapping: Record<Shape, number> = { rock: 1, paper: 2, scissors: 3 };
const scoreOutcomeMapping: Record<Outcome, number> = { loss: 0, draw: 3, win: 6 };
const abcMapping: Record<string, Shape> = { A: 'rock', B: 'paper', C: 'scissors' };
const xyzShapeMapping: Record<string, Shape> = { X: 'rock', Y: 'paper', Z: 'scissors' };
const xyzOutcomeMapping: Record<string, Outcome> = { X: 'loss', Y: 'draw', Z: 'win' };

export function getOutcome(opponent: Shape, player: Shape): Outcome {
  if (opponent === player) return 'draw';
  return defeatsMapping[player] === opponent ? 'win' : 'loss';
}

export function getPlayerShape(opponent: Shape, outcome: Outcome): Shape {
  switch (outcome) {
    case 'draw':
      return opponent;
    case 'loss':
      return defeatsMapping[opponent];
    case 'win':
      return defeatedByMapping[opponent];
  }
}

export function calcShapeStrategyScore(line: string): number {
  if (!line) return 0;
  const lineParts = line.split(' ');
  const opponent = abcMapping[lineParts[0]];
  const player = xyzShapeMapping[lineParts[1]];
  const outcome = getOutcome(opponent, player);
  return scoreShapeMapping[player] + scoreOutcomeMapping[outcome];
}

export function calcOutcomeStrategyScore(line: string): number {
  if (!line) return 0;
  const lineParts = line.split(' ');
  const opponent = abcMapping[lineParts[0]];
  const outcome = xyzOutcomeMapping[lineParts[1]];
  const player = getPlayerShape(opponent, outcome);
  return scoreShapeMapping[player] + scoreOutcomeMapping[outcome];
}
