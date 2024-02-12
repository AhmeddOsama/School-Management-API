const bcrypt = require('bcrypt');

module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "students";
        this.httpExposed         = ['createStudent'];

    }

    async createStudent({name, age}){
        const user = {name, age};

        let createdUser     = await this.mongomodels.user.create(user)
        const {_id, __v, password:pass, ...userDetails } = createdUser.toObject();
        let longToken       = this.tokenManager.genLongToken({userId: createdUser._id, userKey: createdUser.username ,role:createdUser.role});


        return {
            userDetails, 
            longToken 
        };
    }

}
