import { useState } from 'react';
import '../styles/NotesList.css';

function NotesList({ notes, selectedNote, onSelectNote, onCreateNote }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    onCreateNote({ title: 'Untitled Note', body: '', tags: [] });
  };

  return (
    <div className="notes-list-container">
      <div className="list-header">
        <h2>Your Notes ({notes.length})</h2>
        <button onClick={handleCreateNew} className="new-note-btn">+ New</button>
      </div>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="notes-list">
        {filteredNotes.length === 0 ? (
          <p className="empty-message">
            {notes.length === 0 
              ? '📭 No notes yet. Create one!' 
              : '🔍 No notes match your search'}
          </p>
        ) : (
          filteredNotes.map(note => (
            <div
              key={note._id}
              className={`note-item ${selectedNote?._id === note._id ? 'active' : ''}`}
              onClick={() => onSelectNote(note)}
            >
              <h3>{note.title || 'Untitled'}</h3>
              <p>{note.body.substring(0, 60).trim()}...</p>
              <small>{new Date(note.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotesList;