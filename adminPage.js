const express = require('express');
const router = express.Router();
const User = require('./model/User'); 

router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users); 
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
