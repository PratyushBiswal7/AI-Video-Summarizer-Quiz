const Video = require("../models/Video");
const {
  transcribeFromYoutube,
  extractVideoId,
} = require("../services/sttService");
const {
  summarizeText,
  generateQuizFromSummary,
} = require("../services/llmService");
const { safeParseQuiz } = require("../services/parserService");
const { chunkByLength } = require("../utils/chunker");
const { getYoutubeTitle } = require("../services/youtubeService");

const MAX_SUMMARY_CHARS = parseInt(process.env.MAX_SUMMARY_CHARS || "4000", 10);

exports.processVideo = async (req, res) => {
  try {
    const { videoUrl } = req.body;
    const userId = req.user?.userId;
    if (!videoUrl) return res.status(400).json({ error: "videoUrl required" });
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const cached = await Video.findOne({ userId, videoUrl });
    if (cached) return res.json(cached);

    const name = await getYoutubeTitle(videoUrl);

    const { transcript, segments } = await transcribeFromYoutube(videoUrl);

    const chunks = chunkByLength(transcript, MAX_SUMMARY_CHARS);
    const partials = [];
    for (const ch of chunks) {
      partials.push(await summarizeText(ch));
    }
    let summary = partials.join("\n");
    if (partials.length > 1) {
      summary = await summarizeText(
        `Combine these partial summaries into one concise summary within 180 words:\n${summary}`
      );
    }

    const quizRaw = await generateQuizFromSummary(summary);
    const quiz = safeParseQuiz(quizRaw).slice(0, 5);

    const saved = await Video.create({
      userId,
      videoUrl,
      videoId: extractVideoId(videoUrl),
      name,
      transcript,
      segments,
      summary,
      quiz,
    });
    return res.json(saved);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Processing failed", detail: String(e).slice(0, 200) });
  }
};

exports.history = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const items = await Video.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json(items);
  } catch (e) {
    return res.status(500).json({ error: "Failed to load history" });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const video = await Video.findOneAndDelete({ _id: id, userId });
    if (!video) return res.status(404).json({ error: "Not found" });

    return res.json({ message: "Deleted" });
  } catch (e) {
    return res.status(500).json({ error: "Delete failed" });
  }
};
