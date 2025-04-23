export async function separateSong(id: string, filename: string) {
    const formData = new FormData();
    formData.append("id", id);
    formData.append("filename", filename);
  
    try {
      const res = await fetch("http://localhost:8000/separate", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to separate song");
      console.log("✅ Separated");
    } catch (err) {
      console.error("❌ Separation error:", err);
    }
  }
  