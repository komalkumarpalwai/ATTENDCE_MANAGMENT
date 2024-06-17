// server.js
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt'); 
const mongoose = require('./db/mongoose'); 
const User = require('./model/User'); 
const adminPageRouter = require('./adminPage');
const app = express();
app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));

// render home.ejs
app.get('/', (req, res) => {
    res.render('home', {
        pageTitle: 'Attendance System',
        errorMessage: '',
        successMessage: '',
        formData: {} // Ensure formData 
    });
});

app.post('/submit', async (req, res) => {
    const { name, rollNo, section, branch, class: className } = req.body;

    //  if any field is empty
    if (!name || !rollNo || !section || !branch || !className) {
        return res.render('home', {
            pageTitle: 'Attendance System',
            errorMessage: 'Please enter all fields',
            successMessage: '',
            formData: req.body 
        });
    }

    try {
     
        const existingUser = await User.findOne({ rollNo });
        if (existingUser) {
            return res.render('home', {
                pageTitle: 'Attendance System',
                errorMessage: 'Attendance already marked for this Roll Number',
                successMessage: '',
                formData: req.body
            });
        }

        const newUser = new User({
            name,
            rollNo,
            section,
            branch,
            class: className
        });

        await newUser.save();

        res.render('home', {
            pageTitle: 'Attendance System',
            successMessage: 'Attendance marked successfully',
            errorMessage: '',
            formData: {}
        });
    } catch (err) {
        console.error('Error saving to database:', err);
        res.status(500).send('Internal Server Error');
    }
});

const hardcodedAdminEmail = 'ACE_placement@gmail.com';
const hardcodedAdminPassword = 'AceAptitude@2024';

app.get('/admin/login', (req, res) => {
    res.render('adminLogin', {
        pageTitle: 'Admin Login',
        errorMessage: ''
    });
});

app.post('/admin/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === hardcodedAdminEmail && password === hardcodedAdminPassword) {
    
        return res.redirect('/admin');
    }

    try {
     
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('adminLogin', {
                pageTitle: 'Admin Login',
                errorMessage: 'Invalid email or password'
            });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.render('adminLogin', {
                pageTitle: 'Admin Login',
                errorMessage: 'Invalid email or password'
            });
        }

        res.redirect('/admin');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/admin', async (req, res) => {
    try {
      
        const users = await User.find();

        res.render('admin', {
            pageTitle: 'Admin Panel',
            errorMessage: '',
            users: users 
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.use('/admin', adminPageRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
