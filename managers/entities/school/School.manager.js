const bcrypt = require('bcrypt');
const { result } = require('lodash');

module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['get=getClassroomsInSchool','createSchool','put=addClassroomToSchool','delete=removeClassroomFromSchool','delete=deleteSchool','get=getSchools'];
        this.authorised          = ['superadmin']
    }

    async createSchool({__longToken,__isAuthorised,__validate, __device,name}){
        const school = {name};
        const existingSchool = await this.mongomodels.school.findOne({ name:name })

        if(existingSchool){
                const result = {
                    selfHandleResponse:{
                        "ok": false,
                        "message": "School Already Exists!",
                        "code":409
                    }
                }
                return result
        }
        let createdSchool  = await this.mongomodels.school.create(school)

        const { __v,  ...schoolDetails } = createdSchool.toObject();

        return {
            schoolDetails, 
        };
    }

    async addClassroomToSchool({__longToken,__isAuthorised,__validate,classroomId,schoolId}){
        const body = {classroomId,schoolId};
        const classroom = await this.mongomodels.Classroom.findById(classroomId);
        const school =  await this.mongomodels.school.findById(schoolId);
        if (!classroom || !school) {
            return result = {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid School or Classoom!",
                    "code":401
                }
            }
        }

        school.classrooms.push(classroom);
        await school.save();
        const {_id, __v,  ...schoolDetails } = school.toObject();
        return {
            schoolDetails, 
        };
    }   
    async  removeClassroomFromSchool({__longToken,__isAuthorised,__validate, classroomId, schoolId }) {
    
            const classroom = await this.mongomodels.Classroom.findById(classroomId);
            const school = await this.mongomodels.school.findById(schoolId);

            if (!classroom || !school) {
                return result = {
                    selfHandleResponse:{
                        "ok": false,
                        "message": "Invalid School or Classoom!",
                        "code":401
                    }
                }
            }
    
            const index = school.classrooms.indexOf(classroomId);
            if (index !== -1) {
                school.classrooms.splice(index, 1);
            }
    
            await school.save();
    
            const { _id, __v, ...schoolDetails } = school.toObject();
    
            return {
                schoolDetails,
            };
        
    }
    async  deleteSchool({__longToken,__isAuthorised,__validate, __device, schoolId }) {
        
        const result = await  this.mongomodels.school.deleteOne({ _id: schoolId });

        if (result.deletedCount === 0) {
            return result = {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid School ",
                    "code":401
                }
            }
        }

        return {
        };
    
}
async  getSchools({__longToken,__isAuthorised }) {
    const result = await  this.mongomodels.school.find({ }).select('-__v -classrooms')
    return {
        result
    };

}
async  getClassroomsInSchool({__longToken,__isAuthorised,__validate, __device,schoolId }) {
    const result = await  this.mongomodels.school.find({ schoolId }).select('classrooms').populate('classrooms') 
    return {
        result
    };
}
}
