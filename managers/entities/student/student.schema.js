

module.exports = {
    createStudent: [
        {
            model: 'name',
            required: true,
        },
        {
            model: 'age',
            required: true,
        },

    ],

    updateStudent: [
        {
            model: 'name',
            required: true,
        },
        {
            model: 'age',
        },
        {
        model: 'classroomId',

        }
    ],
    deleteStudent:[
        
        {
            model: 'studentId',
            required: true,
        }
    ],
    updateStudentClassroom: [
        {
            model: 'classroomId',
            required:true,
        },
        {
            model: 'studentId',
            required: true,
        },
    ],
}


