const bcrypt = require('bcrypt');

module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.httpExposed         = ['createStudent','get=getAll'];
        this.authorised          = ['school admin']
    }

    async createStudent({__longToken,__isAuthorised, name, age}){
        const student = {name, age};

        let result = await this.validators.student.createStudent(student);
        if(result) return result;

        let createdStudent     = await this.mongomodels.student.create(student)
        const { __v, ...studentDetails } = createdStudent.toObject();


        return {
            studentDetails, 
        };
    }

    async getAll({__longToken,__isAuthorised}){
           const students = await this.mongomodels.student.find().select('-__v')
           return {
            students, 
        };
    }


}
