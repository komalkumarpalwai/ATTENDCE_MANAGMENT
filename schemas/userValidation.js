const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/User');
const db = require('../db/mongoose');

const app = express();
app.use(bodyParser.json());

// Validation middleware
app.post('/validate', async (req, res) => {
    const { name, rollNo, section, branch, class: className } = req.body;

    try {
        // Check if roll number already exists in the database
        const existingUser = await User.findOne({ rollNo });
        if (existingUser) {
            return res.status(400).json({ error: 'Attendance already marked for this roll number' });
        }

        // Create a new user record
        const newUser = new User({
            name,
            rollNo,
            section,
            branch,
            class: className
        });

        // Save the new user record
        await newUser.save();
        res.status(200).json({ message: 'Attendance marked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

