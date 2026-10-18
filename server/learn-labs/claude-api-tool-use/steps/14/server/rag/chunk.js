// Split text into overlapping chunks of about `size` words.
// Overlap repeats the last few words of one chunk at the start of the next,
// so a sentence cut at the border still appears whole in one of them.
export function chunkWords(text, { size = 80, overlap = 20 } = {}) {
  size = Math.max(10, Math.floor(size));
  overlap = Math.min(Math.max(0, Math.floor(overlap)), size - 1);
  const words = String(text).split(/\s+/).filter(Boolean);
  const out = [];
  for (let start = 0; start < words.length; start += size - overlap) {
    out.push(words.slice(start, start + size).join(' '));
    if (start + size >= words.length) break; // the last chunk reached the end
  }
  return out;
}
