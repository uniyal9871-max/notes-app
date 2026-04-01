import React, { useEffect, useState } from 'react';
import { debounce } from 'lodash';

const NoteEditor = ({ currentNote }) => {
    const [noteContent, setNoteContent] = useState(currentNote.content);
    const [currentNoteId, setCurrentNoteId] = useState(currentNote.id);

    const saveNote = debounce((content) => {
        // Save the note content to the server or storage
        console.log('Saving note:', content);
    }, 1000);

    useEffect(() => {
        setNoteContent(currentNote.content);
        setCurrentNoteId(currentNote.id);
        saveNote(noteContent);

        // Cleanup function to cancel debounce on unmount or note change
        return () => {
            saveNote.cancel();
        };
    }, [currentNote]);

    const handleChange = (e) => {
        setNoteContent(e.target.value);
        saveNote(e.target.value);
    };

    return (
        <textarea value={noteContent} onChange={handleChange} />
    );
};

export default NoteEditor;