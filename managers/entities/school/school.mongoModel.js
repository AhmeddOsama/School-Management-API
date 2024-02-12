const mongoose = require('mongoose');

const School = new mongoose.Schema({
    name: { type: String, unique: true }, 
    classrooms:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classroom'
    }],
    admins:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
});

module.exports = mongoose.model("School", School)
