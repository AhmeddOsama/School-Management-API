

module.exports = {
    createClassroom: [
        {
            model: 'name',
            required: true,
        },
        
    ],
    addStudentToClassrooom: [
        {
            model: 'classroomId',
            required: true,
        },
        {
            model: 'studentId',
            required: true,
        },
    ],
}


