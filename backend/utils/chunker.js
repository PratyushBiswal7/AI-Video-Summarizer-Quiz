function chunkByLength(text, maxLen = 4000) {
  if (text.length <= maxLen) return [text];
  const out = [];
  let i = 0;
  while (i < text.length) {
    out.push(text.slice(i, i + maxLen));
    i += maxLen;
  }
  return out;
}
module.exports = { chunkByLength };
