const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

require('dotenv').config();

// JWT Key

const JWT_SECRET = process.env.JWTKEY;

// Register

router.post('/register', [
    body('email').isEmail().withMessage("Enter a valid email address"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ errors: [{ msg: "Email already exists" }] });

            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ email, password: hashedPassword });
            
            await user.save();

            res.json({ msg: "User registered successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({msg: "Server Error"});
        }   
});

// Login

router.post('/login', [
    body('email').isEmail().withMessage("Enter a valid email address"),
    body('password').notEmpty().withMessage("Password is required"),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: "Invalid credentials" });
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({msg: "Server Error"});
        }
});

module.exports = router;