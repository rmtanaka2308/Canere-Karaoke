'use client'

import { useRef, useState } from "react"
import styles from "@/app/(pages)/new-song/page.module.css"
import BackButton from "@/components/BackButton/BackButton"
import ProgressBar from "@/components/ProgressBar/ProgressBar"
import UploadedSongList from "@/components/UploadedSongList/UploadedSongList"
import { sendSongToDb } from "@/app/services/dbServices"

export default function NewSongPage() {
    const [songName, setSongName] = useState("")
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [uploadedSongs, setUploadedSongs] = useState<string[]>([])
    // const [saved, setSaved] = useState(false)
    const [showToast, setShowToast] = useState(false)
    const [pendingUploads, setPendingUploads] = useState<{ file: File, name: string }[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSaveSongs = async () => {
        if (pendingUploads.length === 0) return

        for (const { file, name } of pendingUploads) {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("filename", name)
            await sendSongToDb(formData)
        }

        setPendingUploads([])
        setUploadedSongs([])
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }


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
                <button className={styles.saveButton} onClick={handleSaveSongs}>
                    💾 Save Songs
                </button>
            )}


            {showToast && (
                <div className={styles.toast}>
                    ✅ Songs Saved Successfully
                </div>
            )}


        </main>
    )
}
