// server.js - Updates for environment variable validation, CORS, and MongoDB error handling

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Environment variable validation
if (!process.env.DB_URL) {
    throw new Error('Missing required environment variable: DB_URL');
}

// Strict CORS whitelist
const allowedOrigins = ['https://example.com', 'https://yourdomain.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// MongoDB connection with retry logic
const connectWithRetry = () => {
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('MongoDB connected successfully'))
        .catch(err => {
            console.error('MongoDB connection error: ', err);
            setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
        });
};

connectWithRetry();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});