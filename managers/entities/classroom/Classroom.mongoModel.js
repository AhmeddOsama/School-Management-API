const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: String,
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    school:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }
});

module.exports = mongoose.model("classroom", classroomSchema)
