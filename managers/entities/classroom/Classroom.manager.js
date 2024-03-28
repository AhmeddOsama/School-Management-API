const bcrypt = require('bcrypt');

module.exports = class Clasroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['createClassroom','put=updateClassroom','delete=deleteClassroom','get=getClassrooms','get=getClassroomStudents'];
        this.authorised          = ['school admin']
    }

    async validateClassroomAdmin(classroomId,userId){
        const schools = await this.mongomodels.school.find({ admins: userId })
        const schoolIds = schools.map(school => school._id);

        const classroom = await this.mongomodels.Classroom.find({ schoolId: { $in: schoolIds },_id: classroomId});
        if(!classroom){
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Classroom!",
                    "code":404
                }
            }
        }

    }
    async createClassroom({__longToken,__isAuthorised,name,schoolId}){
        const classroom = {name,schoolId};
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

    async updateClassroom({__longToken,__isAuthorised ,__validate, classroomId,name,schoolId}){
        const userId = __longToken.userId
        await this.validateClassroomAdmin(classroomId,userId)

        const updateClassroomBody = {name,classroomId,schoolId}

        const updatedClassroom = await this.mongomodels.Classroom.findByIdAndUpdate({ _id: classroomId },updateClassroomBody,{ new: true } )
        if(!updatedClassroom){
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Classroom!",
                    "code":404
                }
            }
        }
        const { __v,  ...classDetails } = updatedClassroom.toObject();


        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Successfully Updated Classroom ",
                "code":200,
                data:classDetails
            }        
        };
    }

    async getClassrooms({__longToken,__isAuthorised}){
        const userId = __longToken.userId
        const schools = await this.mongomodels.school.find({ admins: userId }).populate('admins');
        const schoolIds = schools.map(school => school._id);
        const classrooms = await this.mongomodels.Classroom.find({ schoolId: { $in: schoolIds } });
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "",
                "code":200,
                data:classrooms
            }        
        };
    }

    async getClassroomStudents({__longToken,__isAuthorised,__validateQuery}){
        const queryParams = __validateQuery
        const classroom = await this.mongomodels.Classroom.findById(queryParams.classroomId);
        const schoool = await this.mongomodels.school.find({ _id: classroom.schoolId,admins:decoded.userId })
        if(!classroom||!schoool){
            return  {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Classroom or School",
                    "code":404
                }
            }
        }
        const students = await this.mongomodels.student.find({ classroom: queryParams.classroomId })
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "",
                "code":200,
                data:students
            }        
        };
    }

    async  deleteClassroom({__longToken,__isAuthorised,__validateQuery , classroomId }) {
        const params = __validateQuery

        await this.validateClassroomAdmin(params.classroomId,__longToken.userId)

        const result = await  this.mongomodels.Classroom.deleteOne({ _id: params.classroomId });

        if (result.deletedCount === 0) {
            return  {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Classroom ",
                    "code":404
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
