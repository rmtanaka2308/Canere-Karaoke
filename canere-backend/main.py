from fastapi import FastAPI, File, UploadFile, Form, Query, HTTPException
import uuid
from supabase_client import supabase
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime

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

    supabase.table("songs").insert({
        "id": file_id,
        "filename": filename,               
        "original_url": original_url,
        "instrumental_url": None,           
        "lyrics_json": None,          
        "created_at": datetime.utcnow().isoformat()
    }).execute()

    return {"status": "ok", "id": file_id}

@app.get("/songs")
def get_songs(page: int = Query(1, ge=1), limit: int = Query(15, le=100)):
    start = (page - 1) * limit
    end = start + limit - 1  # inclusive no Supabase
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