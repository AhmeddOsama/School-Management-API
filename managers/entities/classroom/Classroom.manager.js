const bcrypt = require('bcrypt');

module.exports = class Clasroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['createClassroom'];
        this.authorised          = ['school admin']
    }

    async createClassroom({__longToken,__isAuthorised, __device,name}){
        const classroom = {name};
        let result = await this.validators.classroom.createClassroom(classroom);
        if(result) return result;

        let createdClass  = await this.mongomodels.Classroom.create(classroom)

        const {_id, __v,  ...classDetails } = createdClass.toObject();


        return {
            classDetails, 
        };
    }

}
