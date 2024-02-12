

module.exports = {
    createUser: [
        {
            model: 'username',
            required: true,
        },
        {
            model: 'password',
            required: true,
        },
        {
            model: 'email',
            required: true,
        },
        {
            model:'role',
            required:true
        }
    ],
}


