"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styles from "./page.module.css";
import { Verse } from "@/model/lyricsModels";
import EditableVerse from "@/components/EditableVerse/EditableVerse";

export default function LyricsPage() {
    const [lyrics, setLyrics] = useState<Verse[]>([]);
    const searchParams = useSearchParams();
    const songId = searchParams.get("id");

    useEffect(() => {
        async function fetchLyrics() {
            if (!songId) return;
            try {
                const res = await fetch(
                    `https://qyowtpkcxleaoeawzacp.supabase.co/storage/v1/object/public/karaoke-songs/${songId}/lyrics.json`
                );
                if (!res.ok) {
                    throw new Error("Failed to fetch lyrics");
                }
                const data = await res.json();
                const formatted = Array.isArray(data) ? data : [data];
                console.log("Lyrics data:", formatted);
                setLyrics(formatted);
            } catch (error) {
                console.error("Error loading lyrics:", error);
            }
        }

        fetchLyrics();
    }, [songId]);

    const updateVerse = (index: number, updatedVerse: Verse) => {
        const updatedLyrics = [...lyrics];
        updatedLyrics[index] = updatedVerse;
        setLyrics(updatedLyrics);
    };
    const saveLyrics = () => {
        console.log("Saving lyrics:", lyrics);
        alert("Lyrics saved to console. Implement actual saving logic.");
    };
    if (!lyrics.length) {
        return <div className={styles.loading}>Carregando letras...</div>;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Lyrics Editor</h1>
                </div>
                <div className={styles.lyricsContainer}>
                    {lyrics.map((verse, index) => (
                        <EditableVerse
                            key={index}
                            verse={verse}
                            updateVerse={updateVerse}
                            index={index}
                        />
                    ))}
                </div>
                <div className={styles.controls}>
                    <button className={styles.saveButton} onClick={saveLyrics}>
                        Save Changes
                    </button>
                </div>
            </div>
        </DndProvider>
    );
}
