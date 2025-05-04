import styles from "../../app/(pages)/lyrics/page.module.css";
import { Verse } from "@/model/lyricsModels";
import DraggableWord from "../DraggableWord/DraggableWord";

interface EditableVerseProps {
    verse: Verse;
    updateVerse: (index: number, updatedVerse: Verse) => void;
    index: number;
}

export default function EditableVerse({ verse, updateVerse, index: verseIndex }: EditableVerseProps) {
    if ((!verse.words || verse.words.length === 0) && verse.startTime === verse.endTime) {
        return null;
    }

    const moveWord = (fromIndex: number, toIndex: number) => {
        const updatedWords = [...verse.words];
        const [movedWord] = updatedWords.splice(fromIndex, 1);
        updatedWords.splice(toIndex, 0, movedWord);

        const updatedVerse: Verse = {
            ...verse,
            words: updatedWords,
            text: updatedWords.map((w) => w.word).join(" "),
        };

        updateVerse(verseIndex, updatedVerse);
    };

    const updateWordText = (wordIndex: number, newText: string) => {
        const updatedWords = [...verse.words];
        updatedWords[wordIndex] = {
            ...updatedWords[wordIndex],
            word: newText,
        };

        const updatedVerse: Verse = {
            ...verse,
            words: updatedWords,
            text: updatedWords.map((w) => w.word).join(" "),
        };

        updateVerse(verseIndex, updatedVerse);
    };

    return (
        <div className={styles.lyricLine}>
            <div className={styles.lineText}>{verse.text}</div>
            <div className={styles.wordsContainer}>
                {verse.words.map((word, wordIndex) => (
                    <DraggableWord
                        key={`${verseIndex}-${wordIndex}`}
                        id={`${verseIndex}-${wordIndex}`}
                        index={wordIndex}
                        word={word}
                        updateWordText={updateWordText}
                        moveWord={moveWord}
                    />
                ))}
            </div>
        </div>
    );
}
