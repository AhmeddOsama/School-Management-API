const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    classroom:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classroom'
    }
});

module.exports = mongoose.model("Student", studentSchema)
