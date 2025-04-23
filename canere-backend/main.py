import os
import subprocess
import uuid
from datetime import datetime
from pathlib import Path
import re
from fastapi import FastAPI, File, UploadFile, Form, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from supabase_client import SUPABASE_URL, supabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # durante o dev, pode deixar assim
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def sanitize_filename(filename: str) -> str:
    return re.sub(r"[^\w\-.]", "_", filename)


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    filename: str = Form(...)  # nome digitado pelo usuário no frontend
):
    contents = await file.read()
    file_id = str(uuid.uuid4())

    # filename original (real do .mp3) usado apenas para storage
    safe_filename = sanitize_filename(file.filename)
    path = f"{file_id}-{safe_filename}/{safe_filename}"

    # Upload para Supabase Storage
    supabase.storage.from_("karaoke-songs").upload(path, contents)

    # URL pública
    original_url = f"{SUPABASE_URL}/storage/v1/object/public/karaoke-songs/{path}"

    # Insere no banco usando o NOME CUSTOMIZADO DO USUÁRIO
    supabase.table("songs").insert({
        "id": file_id,
        "filename": filename,  # ← esse é o nome que o usuário digitou!
        "original_url": original_url,
        "instrumental_url": None,
        "lyrics_json": None,
        "created_at": datetime.utcnow().isoformat(),
        "storage_path": path
    }).execute()

    return {"status": "ok", "id": file_id}


@app.get("/songs")
def get_songs(page: int = Query(1, ge=1), limit: int = Query(15, le=100)):
    start = (page - 1) * limit
    end = start + limit - 1
    response = supabase \
        .table("songs") \
        .select("*") \
        .order("created_at", desc=True) \
        .range(start, end) \
        .execute()

    return response.data


@app.delete("/delete")
def delete_song(id: str = Query(...)):
    try:
        supabase.table("songs").delete().match({"id": id}).execute()
        return {"status": "ok", "id": id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/separate")
async def separate_song(id: str = Form(...), filename: str = Form(...)):
    row = supabase.table("songs").select("storage_path").eq("id", id).single().execute()
    if not row.data:
        raise HTTPException(status_code=404, detail="Música não encontrada")

    storage_path = row.data["storage_path"]
    mp3_path = f"/tmp/{id}_{filename}.mp3"
    output_dir = f"/tmp/{id}_out"
    song_folder = Path(mp3_path).stem

    audio_bytes = supabase.storage.from_("karaoke-songs").download(storage_path)
    with open(mp3_path, "wb") as f:
        f.write(audio_bytes)

    spleeter_python = os.path.join(os.getcwd(), "spleeter-env", "bin", "python")
    spleeter_script = os.path.join(os.getcwd(), "run_spleeter.py")
    spleeter_result = subprocess.run(
        [spleeter_python, spleeter_script, mp3_path, output_dir],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if spleeter_result.returncode != 0:
        print("❌ Spleeter error:")
        print(spleeter_result.stderr)
        raise HTTPException(status_code=500, detail="Spleeter failed")

    vocals_path = Path(output_dir) / song_folder / "vocals.wav"
    instrumental_path = Path(output_dir) / song_folder / "accompaniment.wav"

    with open(instrumental_path, "rb") as f:
        supabase.storage.from_("karaoke-songs").upload(
            path=f"{id}/instrumental.wav",
            file=f,
            file_options={"content-type": "audio/wav"}
        )

    instrumental_url = f"{SUPABASE_URL}/storage/v1/object/public/karaoke-songs/{id}/instrumental.wav"

    lyrics_path = Path(output_dir) / song_folder / "lyrics.json"
    whisper_python = os.path.join(os.getcwd(), "whisper-env", "bin", "python")
    whisper_script = os.path.join(os.getcwd(), "run_whisper.py")

    boosted_vocals_path = vocals_path.with_name("vocals_louder.wav")
    subprocess.run([
        "ffmpeg", "-y", "-i", str(vocals_path),
        "-filter:a", "volume=2.0",
        str(boosted_vocals_path)
    ], check=True)

    whisper_result = subprocess.run(
        [whisper_python, whisper_script, str(boosted_vocals_path), str(lyrics_path)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if whisper_result.returncode != 0:
        print("❌ Whisper error:")
        print(whisper_result.stderr)
        raise HTTPException(status_code=500, detail="Whisper failed")

    with open(lyrics_path, "rb") as f:
        supabase.storage.from_("karaoke-songs").upload(
            path=f"{id}/lyrics.json",
            file=f,
            file_options={"content-type": "application/json"}
        )

    lyrics_url = f"{SUPABASE_URL}/storage/v1/object/public/karaoke-songs/{id}/lyrics.json"

    supabase.table("songs").update({
        "instrumental_url": instrumental_url,
        "lyrics_json": lyrics_url
    }).match({"id": id}).execute()

    for file in [mp3_path, instrumental_path, vocals_path, lyrics_path, boosted_vocals_path]:
        try:
            os.remove(file)
        except Exception:
            pass
   

    return {
        "status": "ok",
        "instrumental_url": instrumental_url,
        "lyrics_json": lyrics_url
    }
