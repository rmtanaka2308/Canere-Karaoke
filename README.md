# 🎤 Canere-Karaoke

**Canere-Karaoke** is a personal project for automatic karaoke generation.

This game allows users to upload `.mp3` files, and the system automatically:
1. Removes the vocals (with [Spleeter](https://github.com/deezer/spleeter)),
2. Transcribes the lyrics (with [Whisper](https://github.com/openai/whisper)),
3. Syncs them with accurate timestamps,
4. Plays the instrumental with a dynamic retro-style karaoke player

---

## 🔧 Technologies Used

###  Frontend
- Next.js + TypeScript

###  Backend (Python + FastAPI)
-  Spleeter: vocal/instrumental separation
-  Whisper: lyric transcription & timestamp alignment
-  Supabase: audio storage & metadata database

---

##  How to Run Locally

### 1. Setup the backend

```bash
cd canere-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Make sure `ffmpeg` is installed**:


### 3. Setup the frontend

```bash
cd ../canere-frontend
npm install
```

### 3. Run the project
```bash
./run.sh
```

---

## 📬 Contact
**Ricardo Tanaka**  
[LinkedIn](https://www.linkedin.com/in/tanakaricardo/)