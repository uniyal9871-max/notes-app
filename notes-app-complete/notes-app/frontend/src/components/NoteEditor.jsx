import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import '../styles/NoteEditor.css';

function NoteEditor({ note, onUpdateNote, onDeleteNote }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setBody(note.body || '');
      setTags((note.tags || []).join(', '));
      setDirty(false);
      setSaved(false);
    }
  }, [note?._id]);

  useEffect(() => {
    if (!note || !dirty) return;
    const timer = setTimeout(() => handleSave(), 1200);
    return () => clearTimeout(timer);
  }, [title, body, tags, dirty]);

  const handleSave = async () => {
    if (!note || !dirty) return;
    setSaving(true);
    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    await onUpdateNote(note._id, { title, body, tags: tagArray });
    setSaving(false);
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setDirty(true);
    setSaved(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this note? This cannot be undone.')) {
      onDeleteNote(note._id);
    }
  };

  if (!note) {
    return (
      <div className="editor-empty">
        <div className="empty-icon">✦</div>
        <p>Select a note or create a new one</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button
            className={`toolbar-btn ${!preview ? 'active' : ''}`}
            onClick={() => setPreview(false)}
          >
            Edit
          </button>
          <button
            className={`toolbar-btn ${preview ? 'active' : ''}`}
            onClick={() => setPreview(true)}
          >
            Preview
          </button>
        </div>
        <div className="toolbar-right">
          <span className="save-status">
            {saving ? 'Saving…' : saved ? '✓ Saved' : dirty ? '●' : ''}
          </span>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {!preview ? (
        <div className="editor-fields">
          <input
            className="title-input"
            type="text"
            placeholder="Note title…"
            value={title}
            onChange={handleChange(setTitle)}
          />
          <input
            className="tags-input"
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={handleChange(setTags)}
          />
          <textarea
            className="body-textarea"
            placeholder="Write your note here… Markdown is supported."
            value={body}
            onChange={handleChange(setBody)}
          />
        </div>
      ) : (
        <div className="preview-area">
          <h1 className="preview-title">{title || 'Untitled'}</h1>
          {tags && (
            <div className="preview-tags">
              {tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
          <div className="markdown-body">
            <ReactMarkdown>{body || '*No content yet.*'}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteEditor;
