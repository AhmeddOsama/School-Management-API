const bcrypt = require('bcrypt');

module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['createSchool','put=addClassroomToSchool','delete=removeClassroomFromSchool','delete=deleteSchool'];
        this.authorised          = ['superadmin']
    }

    async createSchool({__longToken,__isAuthorised, __device,name}){
        const school = {name};
        let result = await this.validators.school.createSchool(school);
        if(result) return result;

        let createdSchool  = await this.mongomodels.school.create(school)

        const { __v,  ...schoolDetails } = createdSchool.toObject();

        return {
            schoolDetails, 
        };
    }

    async addClassroomToSchool({__longToken,__isAuthorised, __device,classroomId,schoolId}){
        const body = {classroomId,schoolId};
        let result = await this.validators.school.addClassroomToSchool(body);
        if(result) return result;

        const classroom = await this.mongomodels.Classroom.findById(classroomId);
        const school =  await this.mongomodels.school.findById(schoolId);
        if (!classroom || !school) {
            throw new Error('Invalid Classroom or Student');
        }

        school.classrooms.push(classroom);
        await school.save();

        const {_id, __v,  ...schoolDetails } = school.toObject();
        
        return {
            schoolDetails, 
        };
    }   
    async  removeClassroomFromSchool({__longToken,__isAuthorised, __device, classroomId, schoolId }) {
        
            const classroom = await this.mongomodels.Classroom.findById(classroomId);
            const school = await this.mongomodels.school.findById(schoolId);
            
            if (!classroom || !school) {
                throw new Error('Invalid Classroom or School');
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
    async  deleteSchool({__longToken,__isAuthorised, __device, schoolId }) {
        
        const result = await  this.mongomodels.school.deleteOne({ _id: schoolId });

        if (result.deletedCount === 0) {
            throw new Error('School not found');
        }

        return {
        };
    
}
    
}
