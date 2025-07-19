const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/performance', require('./routes/performance'));

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/employee', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'employee-dashboard.html'));
});

app.get('/hr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'hr-dashboard.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to access the application`);
    
    // Initialize database
    try {
        await initDatabase();
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
});
