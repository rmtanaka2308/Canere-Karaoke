'use client'

import styles from './MenuButton.module.css'
import { useRouter } from 'next/navigation'

interface MenuButtonProps {
    content: string
    path: string
}

export default function MenuButton({ content, path }: MenuButtonProps) {
    const router = useRouter()

    const handlePush = () => {
        router.push(path)
    }

    return (
        <button className={styles.menuButton} onClick={handlePush}>
            {content}
        </button>
    )
}
