from supabase_client import supabase
import uuid

song_id = str(uuid.uuid4())  # cria um ID único pra pasta

file_path = "test_song.mp3"  # seu arquivo de teste
file_name = f"{song_id}/original.mp3"

with open(file_path, "rb") as f:
    res = supabase.storage.from_("karaoke-songs").upload(file_name, f)
    print(res)
