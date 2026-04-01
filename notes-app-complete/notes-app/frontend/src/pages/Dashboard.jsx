import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotesList from '../components/NotesList';
import NoteEditor from '../components/NoteEditor';
import '../styles/Dashboard.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Dashboard({ token, user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/notes`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status}`);
      }

      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create note');
      }

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
      setError(error.message);
    }
  };

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(noteData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update note');
      }

      const updatedNote = await response.json();
      setNotes(notes.map(n => n._id === noteId ? updatedNote : n));
      setSelectedNote(updatedNote);
    } catch (error) {
      console.error('Error updating note:', error);
      setError(error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete note');
      }

      setNotes(notes.filter(n => n._id !== noteId));
      setSelectedNote(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError(error.message);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📝 Notes App</h1>
        <div className="header-right">
          <span>Welcome, <strong>{user?.name}</strong>!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-content">
        <NotesList
          notes={notes}
          selectedNote={selectedNote}
          onSelectNote={setSelectedNote}
          onCreateNote={handleCreateNote}
        />
        <NoteEditor
          note={selectedNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </div>
  );
}

export default Dashboard;