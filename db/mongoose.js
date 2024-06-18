const mongoose = require('mongoose');
require('dotenv').config();

const mongooseConnect = process.env.MONGODBONLINE;

mongoose.connect(mongooseConnect, {
 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
