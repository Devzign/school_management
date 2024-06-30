const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    console.log('Received token:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        console.log('Token decoded successfully:', decoded);
        next();
    } catch (err) {
        console.log('Token verification failed:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
