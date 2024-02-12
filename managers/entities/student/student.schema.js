

module.exports = {
    createStudent: [
        {
            model: 'name',
            required: true,
        },
        {
            model: 'age',
            required: true,
        }
    ],
    deleteStudent:[
        
        {
            model: 'studentId',
            required: true,
        }
    ]
}


