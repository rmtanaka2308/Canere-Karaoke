# 🎤 Canere-Karaoke

**Canere-Karaoke** is a personal project for automatic karaoke generation.

This game allows users to upload `.mp3` files, and the system automatically:
1. Removes the vocals (with [Spleeter](https://github.com/deezer/spleeter)),
2. Transcribes the lyrics (with [Whisper](https://github.com/openai/whisper)),
3. Syncs them with accurate timestamps,

---

## 🔧 Technologies 

### Frontend
- Next.js + TypeScript

### Backend 
- Python + FastAPI
- Spleeter: vocal/instrumental separation
- Whisper: transcription + timestamps
- Supabase: audio file storage + song metadata database

---

## ⚙️ How to Run Locally

### 1. Clone the project
```bash
git clone https://github.com/your-user/canere-karaoke.git
cd canere-karaoke
```

### 2. Install all dependencies
```bash
./install_all.sh
```

> ✅ Make sure `ffmpeg` is installed

---

### 3. Run the project
```bash
./run.sh
```

---

## 📬 Contact

**Ricardo Tanaka**  
[LinkedIn](https://www.linkedin.com/in/tanakaricardo/)