const bcrypt = require('bcrypt');

module.exports = class Student { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.httpExposed         = ['createStudent','get=getAll','delete=deleteStudent','put=updateStudentClassroom'];
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

    
    async updateStudentClassroom({__longToken,__isAuthorised,__validate,classroomId,studentId}){
        const body = {classroomId,studentId};
        const schools = await this.mongomodels.school.find({ admins: __longToken.userId  }).select('_id')
        const schoolIds = schools.map(school => school._id);
        const classroom = await this.mongomodels.Classroom.findOne({_id: classroomId, school: { $in: schoolIds } });
        const student =  await this.mongomodels.student.findById(studentId);
        if (!classroom || !student) {
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Student or Classoom!",
                    "code":404
                }
            }
        }
        
        if (student.classroom && student.classroom.toString()==classroom._id.toString()) {
            return {
              selfHandleResponse: {
                "ok": false,
                "message": "Student already exists in the Classroom!",
                "code": 409
              }
            };
          }
          student.classroom = classroom._id
          await student.save() ;
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Added Student to  Classroom ",
                "code":200,
                data:student
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
