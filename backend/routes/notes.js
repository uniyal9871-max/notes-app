const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Fixed content with improvements

// Middleware to validate tag array
const validateTags = (tags) => {
    if (!Array.isArray(tags) || tags.length === 0) {
        throw new Error('Tags must be a non-empty array.');
    }
    tags.forEach(tag => {
        if (typeof tag !== 'string') {
            throw new Error('Each tag must be a string.');
        }
    });
};

// Middleware to validate fields
const validateUpdateFields = (data) => {
    if (!data.title && !data.content) {
        throw new Error('At least one field must be provided for update.');
    }
};

// Improved error handling
router.post('/notes', async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        validateTags(tags);

        const note = new Note({ title, content, tags });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/notes/:id', async (req, res) => {
    try {
        validateUpdateFields(req.body);
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;