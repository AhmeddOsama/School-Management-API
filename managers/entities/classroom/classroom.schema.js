

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
    deleteClassroom:[ {
        model: 'classroomId',
        required: true,
    },
],
addClassroomToSchool: [
    {
        model: 'classroomId',
        required: true,
    },
    {
        model: 'schoolId',
        required: true,
    },
],
removeClassroomFromSchool: [
    {
        model: 'classroomId',
        required: true,
    },
    {
        model: 'schoolId',
        required: true,
    },
],
}


