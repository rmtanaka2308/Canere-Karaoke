'use client'

import styles from './BackButton.module.css'
import { useRouter } from 'next/navigation'

export default function BackButton() {
    const router = useRouter()

    const handlePush = () => {
        router.back()
    }

    return (
        <button className={styles.backButton} onClick={handlePush} aria-label="Voltar">
            <span className={styles.arrow} />
        </button>
    )
}
