import { findStartMarker } from './signal-marker.js';

describe('findStartMarker()', () => {
  it.each([
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 'jpqm', 7],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 'vwbj', 5],
    ['nppdvjthqldpwncqszvftbrmjlhg', 'pdvj', 6],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 'rfnt', 10],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 'zqfr', 11],
  ])("handles example '%s'", (buffer, marker, charsToContent) => {
    expect(findStartMarker(buffer, 4)).toEqual({ marker, charsToContent });
  });

  it.each([
    ['mjqjpqmgbljsphdztnvjfqwrcgsmlb', 'qmgbljsphdztnv', 19],
    ['bvwbjplbgvbhsrlpgdmjqwftvncz', 'vbhsrlpgdmjqwf', 23],
    ['nppdvjthqldpwncqszvftbrmjlhg', 'ldpwncqszvftbr', 23],
    ['nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg', 'wmzdfjlvtqnbhc', 29],
    ['zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw', 'jwzlrfnpqdbhtm', 26],
  ])("handles example '%s'", (buffer, marker, charsToContent) => {
    expect(findStartMarker(buffer, 14)).toEqual({ marker, charsToContent });
  });
});
