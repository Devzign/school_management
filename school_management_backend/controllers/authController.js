const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ statusCode: 400, message: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ statusCode: 200, message: 'User registered successfully', token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ statusCode: 500, message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ statusCode: 200, message: 'User logged in successfully', token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ statusCode: 500, message: 'Server error' });
    }
};
