export type Card = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export type Hand = { cards: [Card, Card, Card, Card, Card]; bid: number };

export type HandType =
  | 'Five of a kind'
  | 'Four of a kind'
  | 'Full house'
  | 'Three of a kind'
  | 'Two pair'
  | 'One pair'
  | 'High card';

export function parseHand(line: string): Hand {
  const [cardsPart, bidPart] = line.split(' ');
  const cards: [Card, Card, Card, Card, Card] = [
    cardsPart.charAt(0) as Card,
    cardsPart.charAt(1) as Card,
    cardsPart.charAt(2) as Card,
    cardsPart.charAt(3) as Card,
    cardsPart.charAt(4) as Card,
  ];
  const bid = Number.parseInt(bidPart);
  return { cards, bid };
}

export function identifyHandType(
  handCards: [Card, Card, Card, Card, Card],
  jokerRule = false
): HandType {
  const cardCounts = handCards
    .reduce<{ card: Card; count: number }[]>((acc, handCard) => {
      const cardInfo = acc.find(({ card }) => card === handCard);
      if (cardInfo) {
        cardInfo.count++;
      } else {
        acc.push({ card: handCard, count: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count);

  const jokerCount = cardCounts.find(({ card }) => card === 'J')?.count ?? 0;
  const finalCounts = cardCounts
    .filter(({ card, count }) => !jokerRule || card !== 'J' || count === 5)
    .map(({ card, count }, idx) =>
      jokerRule && idx === 0 && card !== 'J' ? count + jokerCount : count
    );

  if (finalCounts[0] === 5) return 'Five of a kind';
  if (finalCounts[0] === 4) return 'Four of a kind';
  if (finalCounts[0] === 3 && finalCounts[1] === 2) return 'Full house';
  if (finalCounts[0] === 3 && finalCounts[1] === 1) return 'Three of a kind';
  if (finalCounts[0] === 2 && finalCounts[1] === 2) return 'Two pair';
  if (finalCounts[0] === 2 && finalCounts[1] === 1) return 'One pair';
  return 'High card';
}

export function sortHandsByType(handType1: HandType, handType2: HandType): -1 | 0 | 1 {
  const allTypesDescending: HandType[] = [
    'Five of a kind',
    'Four of a kind',
    'Full house',
    'Three of a kind',
    'Two pair',
    'One pair',
    'High card',
  ] as const;
  const idx1 = allTypesDescending.findIndex((handType) => handType === handType1);
  const idx2 = allTypesDescending.findIndex((handType) => handType === handType2);
  if (idx1 < idx2) return 1;
  if (idx1 > idx2) return -1;
  return 0;
}

export function sortCardsByLabel(card1: Card, card2: Card, jokerRule = false): -1 | 0 | 1 {
  const allCardsDescending: Card[] = jokerRule
    ? (['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'] as const)
    : (['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const);
  const idx1 = allCardsDescending.findIndex((card) => card === card1);
  const idx2 = allCardsDescending.findIndex((card) => card === card2);
  if (idx1 < idx2) return 1;
  if (idx1 > idx2) return -1;
  return 0;
}

export function sortHandList(hands: Hand[], jokerRule = false): ({ rank: number } & Hand)[] {
  return [...hands]
    .sort((a, b) => {
      const primarySort = sortHandsByType(
        identifyHandType(a.cards, jokerRule),
        identifyHandType(b.cards, jokerRule)
      );
      if (primarySort !== 0) {
        return primarySort;
      }
      for (let i = 0; i < 5; i++) {
        const secondarySort = sortCardsByLabel(a.cards[i], b.cards[i], jokerRule);
        if (secondarySort !== 0) {
          return secondarySort;
        }
      }
      return 0;
    })
    .map((hand, idx) => ({ rank: idx + 1, ...hand }));
}
