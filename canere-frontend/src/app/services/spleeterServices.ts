export async function separateSong(id: string, name: string): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:8000/separate", {
      method: "POST",
      body: new URLSearchParams({ id, filename: name })
    })

    if (!res.ok) throw new Error("Failed to separate")
    console.log("✅ Separated")
    return true
  } catch (err) {
    console.error("❌ Separation error:", err)
    return false
  }
}
