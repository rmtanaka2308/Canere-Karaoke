import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "../../app/(pages)/lyrics/page.module.css"; // ajuste o caminho se necessário
import { Word } from "@/model/lyricsModels";


interface DraggableWordProps {
    id: string;
    index: number;
    word: Word;
    updateWordText: (index: number, newText: string) => void;
    moveWord: (fromIndex: number, toIndex: number) => void;
}

export default function DraggableWord({ id, index, word, updateWordText, moveWord }: DraggableWordProps) {
    const [editing, setEditing] = useState(false);
    const [text, setText] = useState(word.word);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: "word",
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const [, drop] = useDrop(() => ({
        accept: "word",
        hover(item: { id: string; index: number }) {
            if (item.index !== index) {
                moveWord(item.index, index);
                item.index = index;
            }
        },
    }));

    const handleDoubleClick = () => {
        setEditing(true);
    };

    const handleBlur = () => {
        setEditing(false);
        updateWordText(index, text);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    return (
        <div
            ref={(node) => drag(drop(node))}
            className={`${styles.draggableWord} ${isDragging ? styles.dragging : ""}`}
            onDoubleClick={handleDoubleClick}
        >
            {editing ? (
                <input
                    type="text"
                    value={text}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoFocus
                    className={styles.wordInput}
                />
            ) : (
                <span>{text}</span>
            )}
        </div>
    );
}
