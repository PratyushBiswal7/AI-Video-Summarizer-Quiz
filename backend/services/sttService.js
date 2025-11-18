const { tryCaptions, downloadAudio } = require('./youtubeService');
const { spawn } = require('child_process');

async function transcribeFromYoutube(url) {
  const cap = await tryCaptions(url);
  if (cap && cap.text) {
    const sentences = cap.text.split(/(?<=[.!?])\s+/).filter(Boolean);
    const segments = sentences.map((t, i) => ({ text: t, start: i * 5, end: (i + 1) * 5 }));
    return { transcript: cap.text, segments };
  }
  const { audioPath } = await downloadAudio(url);
  const result = await runLocalWhisper(audioPath);
  return result;
}

function runLocalWhisper(audioPath) {
  return new Promise((resolve, reject) => {
    const py = spawn('python', ['scripts/transcribe.py', audioPath], { cwd: process.cwd() });
    let out = '', err = '';
    py.stdout.on('data', d => out += d.toString());
    py.stderr.on('data', d => err += d.toString());
    py.on('close', code => {
      if (code !== 0) return reject(new Error(err || 'Whisper failed'));
      try {
        const json = JSON.parse(out);
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  });
}

module.exports = { transcribeFromYoutube, extractVideoId: require('./youtubeService').extractVideoId };
