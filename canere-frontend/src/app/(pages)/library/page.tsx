'use client'

import { useEffect, useState } from "react"
import styles from "@/app/(pages)/library/page.module.css"
import { get15Songs } from "@/app/services/dbServices"
import BackButton from "@/components/BackButton/BackButton"
import SongDetailsModal from "@/components/SongDetailsModal/SongDetailsModal"
import SongItem from "@/components/SongItem/SongItem"
import type { Song } from "@/app/services/dbServices"
import MenuButton from "@/components/MenuButton/MenuButton"

export default function LibraryPage() {
    const [songs, setSongs] = useState<Song[]>([])
    const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
    const [search, setSearch] = useState("")
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
    const [selectedSong, setSelectedSong] = useState<Song | null>(null)

    // Load songs on mount
    useEffect(() => {
        async function fetchSongs() {
            const data = await get15Songs()
            setSongs(data)
            setFilteredSongs(data)
        }
        fetchSongs()
    }, [])

    // Filter and sort logic
    useEffect(() => {
        const lower = search.toLowerCase()
        let filtered = songs.filter((song) =>
            song.filename.toLowerCase().includes(lower)
        )

        filtered = filtered.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB
        })

        setFilteredSongs(filtered)
    }, [search, songs, sortOrder])

    // Remove from state on delete
    const handleDelete = (id: string) => {
        setSongs((prev) => prev.filter((song) => song.id !== id))
        setFilteredSongs((prev) => prev.filter((song) => song.id !== id))
        setSelectedSong(null)
    }

    return (
        <main className={styles.background}>
            <div className={styles.topLeft}>
                <BackButton />
            </div>

            <div className={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Search songs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                    className={styles.sortSelect}
                >
                    <option value="newest">📅 Newest First</option>
                    <option value="oldest">📜 Oldest First</option>
                </select>
                <MenuButton content="Add New Song?" path="/new-song" />
            </div>

            <div className={styles.musicMenuContainer}>
                {filteredSongs.map((song) => (
                    <SongItem
                        key={song.id}
                        song={song}
                        onClick={() => setSelectedSong(song)}
                    />
                ))}
            </div>

            {selectedSong && (
                <SongDetailsModal
                    song={selectedSong}
                    onClose={() => setSelectedSong(null)}
                    onDelete={handleDelete}
                />
            )}
        </main>
    )
}
