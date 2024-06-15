

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const logger = require('./logger');
const { authenticate } = require('./auth');
const { addRequestToQueue } = require('./queueManager');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Logger Middleware
function loggerMiddleware(req, res, next) {
    logger.info(`Received request: ${req.method} ${req.url}`);
    next();
}

// Authentication Middleware
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).send('Invalid token');
            }
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).send('No token provided');
    }
}

// Routes
app.post('/login', authenticate);
app.post('/enqueue', authMiddleware, (req, res) => {
    const clientId = req.user.username; // Assuming username is unique for each client
    const request = req.body;
    addRequestToQueue(clientId, request);
    res.status(200).send('Request added to queue');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Internal Server Error');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    logger.info(`Server started on port ${PORT}`);
});

module.exports = app;
