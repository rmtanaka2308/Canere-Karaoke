'use client'

import styles from './ProgressBar.module.css'

interface ProgressBarProps {
    progress: number // 0–100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
    return (
        <div className={styles.container}>
            <div className={styles.barWrapper}>
                <div className={styles.barFill} style={{ width: `${progress}%` }}>
                    <span className={styles.percent}>{progress}%</span>
                </div>
            </div>
        </div>
    )
}
