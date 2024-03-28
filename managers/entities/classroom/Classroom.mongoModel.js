const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema({
    name: String,
    schoolId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }
});

module.exports = mongoose.model("classroom", classroomSchema)
