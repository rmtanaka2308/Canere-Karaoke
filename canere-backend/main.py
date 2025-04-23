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
    # Busca o caminho real do arquivo
    row = supabase.table("songs").select("storage_path").eq("id", id).single().execute()
    if not row.data:
        raise HTTPException(status_code=404, detail="Música não encontrada")

    storage_path = row.data["storage_path"]
    mp3_path = f"/tmp/{id}_{filename}.mp3"

    # Faz o download do .mp3 do Supabase
    audio_bytes = supabase.storage.from_("karaoke-songs").download(storage_path)
    with open(mp3_path, "wb") as f:
        f.write(audio_bytes)

    # Caminho do script e do python do venv
    spleeter_python = os.path.join(os.getcwd(), "spleeter-env", "bin", "python")
    spleeter_script = os.path.join(os.getcwd(), "run_spleeter.py")

    output_dir = f"/tmp/{id}_out"

    # Roda o Spleeter
    result = subprocess.run(
        [spleeter_python, spleeter_script, mp3_path, output_dir],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
)

    if result.returncode != 0:
        print("❌ Spleeter error:")
        print(result.stderr)
        raise HTTPException(status_code=500, detail="Spleeter failed")


    # Caminhos dos arquivos gerados
    song_folder = Path(mp3_path).stem
    vocals_path = Path(output_dir) / song_folder / "vocals.wav"
    instrumental_path = Path(output_dir) / song_folder / "accompaniment.wav"

    # Upload do instrumental.wav
    with open(instrumental_path, "rb") as f:
        supabase.storage.from_("karaoke-songs").upload(
            path=f"{id}/instrumental.wav",
            file=f,
            file_options={"content-type": "audio/wav"}
        )

    instrumental_url = f"{SUPABASE_URL}/storage/v1/object/public/karaoke-songs/{id}/instrumental.wav"

    # Atualiza a tabela
    supabase.table("songs").update({
        "instrumental_url": instrumental_url
    }).match({"id": id}).execute()

    # Limpeza
    os.remove(mp3_path)
    os.remove(instrumental_path)
    if vocals_path.exists():
        os.remove(vocals_path)

    return {
        "status": "ok",
        "instrumental_url": instrumental_url
    }
