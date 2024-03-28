

module.exports = {
    createClassroom: [
        {
            model: 'name',
            required: true,
        },
        {
            model: 'schoolId',
            required: true,
        },
        
    ],
    updateClassroom: [
        {
            model: 'classroomId',
            required: true,
        },
        {
            model: 'name',
        },
        {
            model: 'schoolId',
        },
    ],
    deleteClassroom:[ {
        model: 'classroomId',
        required: true,
    },],
    getClassroomStudents:[ {
        model: 'classroomId',
        required: true,
    },]
}


