import sys
import whisper
import json
from pathlib import Path

audio_path = sys.argv[1]
output_path = sys.argv[2]

model = whisper.load_model("small.en")  # ou "small", "medium", "large"
result = model.transcribe(audio_path, word_timestamps=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(result["segments"], f, ensure_ascii=False, indent=2)

print(f"✅ Transcription saved to {output_path}")
