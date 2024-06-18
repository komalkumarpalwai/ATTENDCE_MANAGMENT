require('dotenv').config();
const mongoose = require('mongoose');

const mongooseconnect = process.env.MONGODBONLINE; 

mongoose.connect(mongooseconnect, { 
  
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;
