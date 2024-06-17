
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    section: { type: String, required: true },
    branch: { type: String, required: true },
    class: { type: String, required: true },
    markedAt: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
