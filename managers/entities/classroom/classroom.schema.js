

module.exports = {
    createClassroom: [
        {
            model: 'name',
            required: true,
        },
        
    ],
  
    deleteClassroom:[ {
        model: 'classroomId',
        required: true,
    },
],
updateClassroomSchool: [
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


