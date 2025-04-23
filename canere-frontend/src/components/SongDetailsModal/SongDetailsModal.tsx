'use client'

import { useState } from 'react'
import { deleteSong } from '@/app/services/dbServices'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal/ConfirmDeleteModal'
import styles from './SongDetailsModal.module.css'

interface Song {
    id: string
    filename: string
    original_url: string
    instrumental_url: string | null
    lyrics_json: string | null
    created_at: string
}

interface Props {
    song: Song
    onClose: () => void
    onDelete: (id: string) => void
}

function formatDate(isoString: string): string {
    const date = new Date(isoString)
    return date.toLocaleDateString('pt-BR')
}

export default function SongDetailsModal({ song, onClose, onDelete }: Props) {
    const [showToast, setShowToast] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [closing, setClosing] = useState(false)

    const handleClose = () => {
        setClosing(true)
        setTimeout(onClose, 300) // ⏳ bate com o tempo da animação
    }

    const handleDelete = async () => {
        await deleteSong(song.id)
        onDelete(song.id)
        setShowConfirm(false)
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
    }

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>

            <div className={`${styles.modal} ${closing ? styles.slideOut : styles.slideIn}`} onClick={(e) => e.stopPropagation()}>

                <h2>{song.filename}</h2>
                <p><strong>Original URL:</strong> <a href={song.original_url} target="_blank">{song.original_url}</a></p>
                <p><strong>Instrumental URL:</strong>{' '}
                    {song.instrumental_url ? (
                        <a href={song.instrumental_url} target="_blank" rel="noopener noreferrer">
                            {song.instrumental_url}
                        </a>
                    ) : (
                        'Not yet processed'
                    )}
                </p>

                <p><strong>Lyrics:</strong></p>
                <pre>{song.lyrics_json || 'Not yet transcribed'}</pre>
                <p><strong>Created at:</strong> {formatDate(song.created_at)}</p>

                <button className={styles.deleteButton} onClick={() => setShowConfirm(true)}>🗑 Delete Song</button>
                <button className={styles.closeButton} onClick={handleClose}>Close</button>


                {showToast && <div className={styles.toast}>✅ Song deleted</div>}

                <ConfirmDeleteModal
                    visible={showConfirm}
                    filename={song.filename}
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={handleDelete}
                />
            </div>
        </div>
    )
}
