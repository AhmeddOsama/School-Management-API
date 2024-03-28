const bcrypt = require('bcrypt');

module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.httpExposed         = ['createStudent','get=getFreeStudents','delete=deleteStudent','put=updateStudent'];
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

    async getFreeStudents({__longToken,__isAuthorised}){
           const students = await this.mongomodels.student.find({ classroomId: { $exists: false } }).select('-__v')
           return {
            selfHandleResponse:{
                "ok": true,
                "message": "",
                "code":200,
                "data":students
            }        
        };
    }

    
    async updateStudent({__longToken,__isAuthorised ,__validate, age,name,classroomId}){
        const updateStudentBody = {age,classroomId}
        const student = await this.mongomodels.student.find({ name: name })
        if(!student){
             return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Student!",
                    "code":404
                }
            }
        }
        if(student.classroomId){
            const classroom = await this.mongomodels.Classroom.findById(student.classroomId);

            const school = await this.mongomodels.school.find({ admins: userId,_id:classroom.schoolId })
            if(!school){
                return {
                    selfHandleResponse:{
                        "ok": false,
                        "message": "Invalid School!",
                        "code":404
                    }
                }
            }
        }
        const updatedStudent = await this.mongomodels.student.findOneAndUpdate({ name: name },updateStudentBody,{ new: true } )
        if(!updatedStudent){
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Student!",
                    "code":404
                }
            }
        }
        const { __v,  ...studentDetails } = updatedStudent.toObject();


        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Updated Student ",
                "code":200,
                data:studentDetails
            }        
        };
    }

    async  deleteStudent({__longToken,__isAuthorised,__validateQuery  }) {
        const queryParams = __validateQuery
        const result = await  this.mongomodels.student.deleteOne({ _id: queryParams.studentId });

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
