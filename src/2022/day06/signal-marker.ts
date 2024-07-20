export function findStartMarker(
  buffer: string,
  markerLength: number
): { marker: string; charsToContent: number } {
  for (let charsToContent = markerLength; charsToContent < buffer.length; charsToContent++) {
    const marker = buffer.slice(charsToContent - markerLength, charsToContent);
    if (new Set(marker.split('')).size === markerLength) {
      return { marker, charsToContent };
    }
  }
  return { marker: '', charsToContent: -1 };
}
