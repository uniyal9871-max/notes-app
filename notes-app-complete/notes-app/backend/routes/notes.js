const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all notes for logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, body, tags } = req.body;

    // Validation
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    if (title.trim().length === 0 || body.trim().length === 0) {
      return res.status(400).json({ message: 'Title and body cannot be empty' });
    }

    const newNote = new Note({
      userId: req.userId,
      title: title.trim(),
      body: body.trim(),
      tags: tags ? tags.map(tag => tag.trim()).filter(tag => tag) : []
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Error creating note', error: error.message });
  }
});

// Get a single note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns this note
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ message: 'Error fetching note', error: error.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns this note
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Update only provided fields
    if (title !== undefined) note.title = title.trim();
    if (body !== undefined) note.body = body.trim();
    if (tags !== undefined) note.tags = tags.map(tag => tag.trim()).filter(tag => tag);
    
    note.updatedAt = new Date();

    await note.save();
    res.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ message: 'Error updating note', error: error.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user owns this note
    if (note.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

module.exports = router;