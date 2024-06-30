const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Connect Database
connectDB();

// Enable CORS
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', require('./routes/auth'));

// Example Protected Route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Access granted to protected route' });
});

// Change the port number here
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
