const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

function runYtDlp(args) {
  return new Promise((resolve, reject) => {
    execFile("yt-dlp", args, (err, stdout, stderr) => {
      if (err) return reject(stderr || err);
      resolve(stdout);
    });
  });
}

function extractVideoId(url) {
  const m = url.match(/v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
  return m ? m[1] : null;
}

async function tryCaptions(url) {
  const id = extractVideoId(url);
  const outDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const base = path.join(outDir, id);
  const vttPath = `${base}.en.vtt`;

  try {
    await runYtDlp([
      "--write-auto-subs",
      "--sub-lang",
      "en",
      "--skip-download",
      "-o",
      base,
      url,
    ]);
    if (fs.existsSync(vttPath)) {
      const vtt = fs.readFileSync(vttPath, "utf8");
      const text = vtt
        .replace(/^WEBVTT.*$/gim, "")
        .replace(
          /\d{2,}:\d{2}:\d{2}\.\d{3}\s*-->\s*\d{2,}:\d{2}:\d{2}\.\d{3}/g,
          ""
        )
        .replace(/^\d+$/gm, "")
        .replace(/\s+/g, " ")
        .trim();
      return { text };
    }
  } catch (_) {}
  return null;
}

async function downloadAudio(url) {
  const id = extractVideoId(url);
  const outDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const audioPath = path.join(outDir, `${id}.m4a`);
  await runYtDlp(["-x", "--audio-format", "m4a", "-o", audioPath, url]);
  return { audioPath };
}

async function getYoutubeTitle(url) {
  try {
    const title = await runYtDlp(["--get-title", url]);
    return title.trim();
  } catch (e) {
    return "";
  }
}

module.exports = {
  extractVideoId,
  tryCaptions,
  downloadAudio,
  getYoutubeTitle,
};
