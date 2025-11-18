#!/usr/bin/env python3
import sys, json
from faster_whisper import WhisperModel

if len(sys.argv) < 2:
    print(json.dumps({"error": "audio path required"}))
    sys.exit(1)

audio_path = sys.argv[1]
model = WhisperModel("base", device="cpu", compute_type="int8")
segments, info = model.transcribe(audio_path, vad_filter=True)

all_text = []
seg_list = []
for seg in segments:
    t = seg.text.strip()
    if not t:
        continue
    all_text.append(t)
    seg_list.append({"text": t, "start": float(seg.start), "end": float(seg.end)})

print(json.dumps({"transcript": " ".join(all_text), "segments": seg_list}))
