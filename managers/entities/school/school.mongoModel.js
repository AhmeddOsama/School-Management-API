const mongoose = require('mongoose');

const School = new mongoose.Schema({
    name: { type: String, unique: true }, 
    classrooms:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classroom'
    }],
    
});

module.exports = mongoose.model("School", School)
