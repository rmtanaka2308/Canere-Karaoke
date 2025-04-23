export interface Song {
  id: string
  filename: string
  original_url: string
  instrumental_url: string | null
  lyrics_json: string | null
  created_at: string
}

export async function sendSongToDb(formData: FormData): Promise<string> {
  try {
    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to upload");
    const data = await res.json();
    return data.id as string;
  } catch (err) {
    console.error("❌ Upload error:", err);
    throw err;
  }
}


export async function get15Songs(page = 1, limit = 15): Promise<Song[]> {
  try {
    const res = await fetch(`http://localhost:8000/songs?page=${page}&limit=${limit}`)
    if (!res.ok) throw new Error("Failed to get songs")
    return await res.json()
  } catch (err) {
    console.error("Get error:", err)
    return []
  }
}

export async function deleteSong(id: string){
  try {
    const res = await fetch(`http://localhost:8000/delete?id=${id}`, {
      method: "DELETE"
    })
    if (!res.ok) throw new Error("Failed to delete song")
      console.log("✅ Deleted")
  } catch (err) {
    console.error("Get error:", err)
  }
}


