from fastapi import FastAPI, File, UploadFile, Form
import uuid
from supabase_client import supabase
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # durante o dev, pode deixar assim
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    filename: str = Form(...)
):
    contents = await file.read()
    file_id = str(uuid.uuid4())
    path = f"{file_id}/{file.filename}"

    supabase.storage.from_("karaoke-songs").upload(path, contents)

    original_url = f"https://qyowtpkcxleaoeawzacp.supabase.co/storage/v1/object/public/karaoke-songs/{path}"

    # Inserir registro no banco
    supabase.table("songs").insert({
        "id": file_id,
        "filename": filename,                # nome dado no frontend
        "original_url": original_url,
        "instrumental_url": None,            # será preenchido depois pelo processo do Spleeter
        "lyrics_json": None,             # será preenchido depois pelo Whisper
        "created_at": None                   # Supabase preenche automaticamente se for `default now()`
    }).execute()

    return {"status": "ok", "id": file_id}
