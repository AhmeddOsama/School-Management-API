const bcrypt = require('bcrypt');

module.exports = class Clasroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['createClassroom','put=addStudentToClassrooom','delete=deleteClassroom'];
        this.authorised          = ['school admin']
    }

    async createClassroom({__longToken,__isAuthorised, __device,name}){
        const classroom = {name};
        let result = await this.validators.classroom.createClassroom(classroom);
        if(result) return result;

        let createdClass  = await this.mongomodels.Classroom.create(classroom)

        const { __v,  ...classDetails } = createdClass.toObject();


        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Created Classroom ",
                "code":200,
                data:classDetails
            }        
        };
    }

    async addStudentToClassrooom({__longToken,__isAuthorised, __device,classroomId,studentId}){
        const body = {classroomId,studentId};
        let result = await this.validators.classroom.addStudentToClassrooom(body);
        if(result) return result;


        const classroom = await this.mongomodels.Classroom.findById(classroomId);
        const student =  await this.mongomodels.student.findById(studentId);
        if (!classroom || !student) {
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Student or Classoom!",
                    "code":401
                }
            }
        }
        
        if (classroom.students.includes(studentId)) {
            return {
              selfHandleResponse: {
                "ok": false,
                "message": "Student already exists in the Classroom!",
                "code": 409
              }
            };
          }
        classroom.students.push(student);
        await classroom.save() ;
        const populatedClassroom = await classroom.populate('students')
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Added Student to  Classroom ",
                "code":200,
                data:populatedClassroom
            }        
        };
    }

    async  deleteClassroom({__longToken,__isAuthorised,__validate , classroomId }) {
        const result = await  this.mongomodels.Classroom.deleteOne({ _id: classroomId });

        if (result.deletedCount === 0) {
            return  {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Classroom ",
                    "code":401
                }
            }
        }

        return   {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Deleted Classrooom ",
                "code":200
            }
        }
    
}
}
