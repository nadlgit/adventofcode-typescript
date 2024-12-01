import { ChiefNotes } from './chief-notes.js';

describe('ChiefNotes.parseLists()', () => {
  it('handle example', () => {
    const lines = ['3   4', '4   3', '2   5', '1   3', '3   9', '3   3'];
    expect(ChiefNotes.parseLists(lines)).toEqual(
      new ChiefNotes([3, 4, 2, 1, 3, 3], [4, 3, 5, 3, 9, 3])
    );
  });

  it('ignore empty lines', () => {
    const lines = ['', '4   3', '', '1   3', ''];
    expect(ChiefNotes.parseLists(lines)).toEqual(new ChiefNotes([4, 1], [3, 3]));
  });
});

describe('ChiefNotes.calcDistance()', () => {
  it('handle example', () => {
    const notes = new ChiefNotes([3, 4, 2, 1, 3, 3], [4, 3, 5, 3, 9, 3]);
    expect(notes.calcDistance()).toEqual([2, 1, 0, 1, 2, 5]);
  });
});

describe('ChiefNotes.calcSimilarityScore()', () => {
  it('handle example', () => {
    const notes = new ChiefNotes([3, 4, 2, 1, 3, 3], [4, 3, 5, 3, 9, 3]);
    expect(notes.calcSimilarityScore()).toEqual([9, 4, 0, 0, 9, 9]);
  });
});
