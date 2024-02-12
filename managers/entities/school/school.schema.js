

module.exports = {
    createSchool: [
        {
            model: 'name',
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
    getClassroomsInSchool: [
        {
            model: 'schoolId',
            required: true,
        },
    ],
    deleteSchool: [
        {
            model: 'schoolId',
            required: true,
        },
    ],
    addSchoolAdmin: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'name',
            required: true,
        },
    ],
 
}


