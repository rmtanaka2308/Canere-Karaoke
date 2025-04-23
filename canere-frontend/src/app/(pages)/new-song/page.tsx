'use client'

import { useRef, useState, useEffect } from "react"
import styles from "@/app/(pages)/new-song/page.module.css"
import BackButton from "@/components/BackButton/BackButton"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import UploadedSongList from "@/components/UploadedSongList/UploadedSongList"
import { sendSongToDb } from "@/app/services/dbServices"
import { separateSong } from "@/app/services/spleeterServices"

export default function NewSongPage() {
    const [songName, setSongName] = useState("")
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadedSongs, setUploadedSongs] = useState<string[]>([])
    const [processing, setProcessing] = useState(false)
    const [errorToast, setErrorToast] = useState(false)
    const [dotCount, setDotCount] = useState(1)

    const [showToast, setShowToast] = useState(false)
    const [pendingUploads, setPendingUploads] = useState<{ file: File, name: string }[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)


    useEffect(() => {
        if (!processing) return

        const interval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4) // 0 → 1 → 2 → 3 → 0
        }, 500)

        return () => clearInterval(interval)
    }, [processing])


    const handleSaveSongs = async () => {
        if (pendingUploads.length === 0) return;

        setProcessing(true)

        for (const { file, name } of pendingUploads) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("filename", name);

            const song_id = await sendSongToDb(formData);
            if (song_id) {
                const success = await separateSong(song_id, name);
                if (!success) {
                    setErrorToast(true);
                    setProcessing(false);
                    setTimeout(() => setErrorToast(false), 3000);
                    return;
                }
            }
        }

        setProcessing(false);
        setPendingUploads([]);
        setUploadedSongs([]);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };




    const handleSongNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && songName.trim()) {
            fileInputRef.current?.click()
        }
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !songName.trim()) return

        setUploading(true)
        setProgress(0)

        let prog = 0
        const interval = setInterval(() => {
            prog += Math.random() * 10
            if (prog >= 100) {
                prog = 100
                clearInterval(interval)
                setTimeout(() => {
                    setUploading(false)
                    setPendingUploads((prev) => [...prev, { file, name: songName }])
                    setUploadedSongs((prev) => [...prev, songName])
                    setSongName("")
                    if (fileInputRef.current) fileInputRef.current.value = ""
                }, 400)
            }
            setProgress(Math.floor(prog))
        }, 200)
    }


    return (
        <main className={styles.background}>
            <div className={styles.topLeft}>
                <BackButton />
            </div>

            <div className={styles.title}>
                Upload a new song here!! (MP3)
                <input
                    type="text"
                    placeholder="Enter a song name and press Enter"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    onKeyDown={handleSongNameKeyDown}
                    className={styles.songInput}
                />
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".mp3"
                className={styles.fileInput}
                onChange={handleFileChange}
            />

            {uploading && <ProgressBar progress={progress} />}

            <UploadedSongList
                songs={uploadedSongs}
                onDelete={(index) =>
                    setUploadedSongs((prev) => prev.filter((_, i) => i !== index))
                }
            />

            {uploadedSongs.length > 0 && (
                <button
                    className={styles.saveButton}
                    onClick={handleSaveSongs}
                    disabled={processing}
                >
                    {processing ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span>🔄 Separating vocals{'.'.repeat(dotCount)}</span>
                            <span style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                                This may take a while
                            </span>
                        </div>
                    ) : (
                        '💾 Save Songs'
                    )}
                </button>

            )}




            {showToast && (
                <div className={styles.toast}>
                    ✅ Songs Saved Successfully
                </div>
            )}

            {errorToast && (
                <div className={styles.toast}>
                    ❌ Failed to process song
                </div>
            )}


        </main>
    )
}
