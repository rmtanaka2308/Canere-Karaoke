# 🎤 Canere-Karaoke

**Canere-Karaoke** é um projeto pessoal de karaokê automático.

Este jogo permite que usuários façam upload de músicas `.mp3` e o sistema automaticamente:
1. Remove os vocais,
2. Transcreve a letra,
3. Sincroniza com os timestamps corretos,
4. Reproduz o instrumental com um player estilo karaoke dinâmico e retrô ✨

---

## 🔧 Tecnologias Utilizadas

### Frontend (Next.js + TypeScript)
- `Next.js` + `TypeScript`

### Backend (FastAPI + Python)
- Usa **Spleeter** para separar vocais e instrumentais
- Usa **Whisper** para transcrever e sincronizar as letras
- Retorna a faixa instrumental + `.json` da letra com timestamps

---

## ⚙️ Como rodar localmente

### 1. Clone o projeto
```bash
git clone https://github.com/seu-user/canere-karaoke.git
cd canere-karaoke
```

### 2. Rodar o backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Rodar o frontend
```bash
cd frontend
npm install
npm run dev
```

---


## 🧠 Motivação

Este projeto surgiu com o objetivo de praticar a criação de projetos reais com tecnologias atuais e me divertir fazendo isso!

---

## 📬 Contato

Ricardo Tanaka  
[LinkedIn](https://www.linkedin.com/in/tanakaricardo/)