# 🎤 Canere-Karaoke

**Canere-Karaoke** is a personal project for automatic karaoke generation.

This game allows users to upload `.mp3` files, and the system automatically:
1. Removes the vocals,
2. Transcribes the lyrics,
3. Syncs them with accurate timestamps,
4. Plays the instrumental with a dynamic retro-style karaoke player ✨

---

## 🔧 Technologies Used

### Frontend (Next.js + TypeScript)
- `Next.js` + `TypeScript`

### Backend (FastAPI + Python)
- Uses **Spleeter** to separate vocals and instrumentals
- Uses **Whisper** to transcribe and synchronize lyrics
- Returns the instrumental track + `.json` file with synced lyrics and timestamps

---

## ⚙️ How to Run Locally

### 1. Clone the project
```bash
git clone https://github.com/seu-user/canere-karaoke.git
cd canere-karaoke
```

### 2. Run the backend
```bash
cd canere-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Run the frontend
```bash
cd canere-frontend
npm install
npm run dev
```

---

## 🧠 Motivation

This project was created to practice building real-world projects with modern technologies and to have fun doing it!

---

## 📬 Contact

Ricardo Tanaka  
[LinkedIn](https://www.linkedin.com/in/tanakaricardo/)