const mongoose = require('mongoose');

const School = new mongoose.Schema({
    name: String,
    classrooms:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classroom'
    }],
    
});

module.exports = mongoose.model("School", School)
