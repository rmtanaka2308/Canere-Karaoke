'use client'

import styles from './SongItem.module.css'
import { Song } from '@/app/services/dbServices'

interface Props {
    song: Song
    onClick: () => void
}

export default function SongItem({ song, onClick }: Props) {
    return (
        <div className={styles.uploadedItem} onClick={onClick}>
            {song.filename}
        </div>
    )
}
