function safeParseQuiz(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (_e) {
    const m = jsonStr.match(/\[[\s\S]*\]/);
    if (m) {
      try { return JSON.parse(m[0]); } catch (_e2) {}
    }
  }
  return [];
}
module.exports = { safeParseQuiz };
