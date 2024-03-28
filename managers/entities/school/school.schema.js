

module.exports = {
    createSchool: [
        {
            model: 'name',
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


