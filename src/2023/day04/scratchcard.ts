export type ScratchCard = { winningList: number[]; playerList: number[] };

export function parseCard(line: string): ScratchCard {
  const [_, numsPart] = line.replace(/ +/g, ' ').split(':');
  const [winningList, playerList] = numsPart.split('|').map((part) =>
    part
      .trim()
      .split(' ')
      .map((str) => Number.parseInt(str))
  );
  return { winningList, playerList };
}

export function identifyWinningNumbers(winningList: number[], playerList: number[]): number[] {
  return winningList.filter((num) => playerList.includes(num));
}

export function calcWinningPoints(winningNumbers: number[]): number {
  return winningNumbers.length > 0 ? 2 ** Math.max(0, winningNumbers.length - 1) : 0;
}

export function countFinalCards(cards: ScratchCard[]): number[] {
  const cardsCount = new Array(cards.length).fill(1);
  cards.forEach(({ winningList, playerList }, cardIdx) => {
    const winningCount = identifyWinningNumbers(winningList, playerList).length;
    for (let i = cardIdx + 1; i < Math.min(cardIdx + 1 + winningCount, cards.length); i++) {
      cardsCount[i] += cardsCount[cardIdx];
    }
  });
  return cardsCount;
}
