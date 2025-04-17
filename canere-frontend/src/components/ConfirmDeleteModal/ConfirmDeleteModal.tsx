'use client'

import styles from './ConfirmDeleteModal.module.css'

interface Props {
    visible: boolean
    onCancel: () => void
    onConfirm: () => void
    filename: string
}

export default function ConfirmDeleteModal({ visible, onCancel, onConfirm, filename }: Props) {
    if (!visible) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>⚠️ Confirm Deletion</h3>
                <p>Are you sure you want to permanently delete <strong>{filename}</strong>?</p>
                <div className={styles.actions}>
                    <button className={styles.cancelButton} onClick={onCancel}>Cancel</button>
                    <button className={styles.confirmButton} onClick={onConfirm}>Yes, Delete</button>
                </div>
            </div>
        </div>
    )
}
