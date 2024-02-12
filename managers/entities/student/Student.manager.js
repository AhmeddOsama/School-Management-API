const bcrypt = require('bcrypt');

module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.httpExposed         = ['createStudent','get=getAll','delete=deleteStudent'];
        this.authorised          = ['school admin']
    }

    async createStudent({__longToken,__isAuthorised,__validate, name, age}){
        const student = {name, age};

        let result = await this.validators.student.createStudent(student);
        if(result) return result;

        let createdStudent     = await this.mongomodels.student.create(student)
        const { __v, ...studentDetails } = createdStudent.toObject();
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Created Student",
                "code":200,
                "data":studentDetails
            }
        };
    }

    async getAll({__longToken,__isAuthorised}){
           const students = await this.mongomodels.student.find().select('-__v')
           return {
            selfHandleResponse:{
                "ok": true,
                "message": "",
                "code":200,
                "data":students
            }        
        };
    }

    async  deleteStudent({__longToken,__isAuthorised,__validate , studentId }) {
        const result = await  this.mongomodels.student.deleteOne({ _id: studentId });

        if (result.deletedCount === 0) {
            return  {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Student Id ",
                    "code":404
                }
            }
        }

        return   {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Deleted Student ",
                "code":200
            }
        }
    
}

}
