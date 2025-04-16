'use client'

import styles from './UploadedSongList.module.css'

interface UploadedSongListProps {
    songs: string[]
    onDelete: (index: number) => void
}

export default function UploadedSongList({ songs, onDelete }: UploadedSongListProps) {
    if (songs.length === 0) return null

    return (
        <div className={styles.uploadedList}>
            {songs.map((song, idx) => (
                <div key={idx} className={styles.uploadedItem}>
                    <span>🎵 {song}</span>
                    <button
                        className={styles.deleteButton}
                        onClick={() => onDelete(idx)}
                        aria-label={`Delete ${song}`}
                    >
                        ✖
                    </button>
                </div>
            ))}
        </div>
    )
}
