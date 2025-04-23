#!/bin/bash

set -e  # Para o script se algo der errado
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASE_DIR/canere-backend"

echo "🚀 Creating backend venv..."
python3 -m venv venv
source venv/bin/activate
pip install -r requirements/base.txt
deactivate
echo "✅ Backend environment ready."

echo "🎵 Creating spleeter-env..."
python3 -m venv spleeter-env
source spleeter-env/bin/activate
pip install -r requirements/spleeter.txt
deactivate
echo "✅ Spleeter environment ready."

echo "🧠 Creating whisper-env..."
python3 -m venv whisper-env
source whisper-env/bin/activate
pip install -r requirements/whisper.txt
deactivate
echo "✅ Whisper environment ready."

echo "✅ All environments set up successfully!"
