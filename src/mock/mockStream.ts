export function simulateStream(
  fullText: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  chunkSize = 6,
  intervalMs = 18
): () => void {
  let i = 0;
  const id = setInterval(() => {
    if (i >= fullText.length) {
      clearInterval(id);
      onDone();
      return;
    }
    onChunk(fullText.slice(i, i + chunkSize));
    i += chunkSize;
  }, intervalMs);
  return () => clearInterval(id);
}
