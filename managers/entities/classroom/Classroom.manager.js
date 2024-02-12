const bcrypt = require('bcrypt');

module.exports = class Clasroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['createClassroom','put=addStudentToClassrooom'];
        this.authorised          = ['school admin']
    }

    async createClassroom({__longToken,__isAuthorised, __device,name}){
        const classroom = {name};
        let result = await this.validators.classroom.createClassroom(classroom);
        if(result) return result;

        let createdClass  = await this.mongomodels.Classroom.create(classroom)

        const { __v,  ...classDetails } = createdClass.toObject();


        return {
            classDetails, 
        };
    }

    async addStudentToClassrooom({__longToken,__isAuthorised, __device,classroomId,studentId}){
        const body = {classroomId,studentId};
        let result = await this.validators.classroom.addStudentToClassrooom(body);
        if(result) return result;


        const classroom = await this.mongomodels.Classroom.findById(classroomId);
        const student =  await this.mongomodels.student.findById(studentId);
        if (!classroom || !student) {
            throw new Error('Invalid Classroom or Student');
        }

        classroom.students.push(student);
        await classroom.save();

        const {_id, __v,  ...classDetails } = classroom.toObject();


        return {
            classDetails, 
        };
    }
}
