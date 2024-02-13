const bcrypt = require('bcrypt');
const { result } = require('lodash');

module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['put=addSchoolAdmin','createSchool','put=addClassroomToSchool','delete=removeClassroomFromSchool','delete=deleteSchool','get=getSchools'];
        this.authorised          = ['superadmin','school admin']
        this.protection          = {
            createSchool:['superadmin'],
            getClassroomsInSchool:['school admin'],
            addSchoolAdmin:['superadmin'],
            addClassroomToSchool:['school admin'],
            removeClassroomFromSchool:['school admin'],
            deleteSchool:['superadmin'],
            getSchools:['superadmin','school admin']
        }   
    }

    async createSchool({__longToken,__isAuthorised,__protect,__validate, __device,name}){
        const existingSchool = await this.mongomodels.school.findOne({ name:name })

        if(existingSchool){
                return  {
                    selfHandleResponse:{
                        "ok": false,
                        "message": "School Already Exists!",
                        "code":409
                    }
                }
        }
        let createdSchool  = await this.mongomodels.school.create({name})

        const { __v,  ...schoolDetails } = createdSchool.toObject();

        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Success",
                "data":schoolDetails,
                "code":200
            }
        }
    }
    async addSchoolAdmin({__longToken,__isAuthorised,__protect,__validate,name,username}){
        const school = await this.mongomodels.school.findOne({ name:name })
        const admin = await this.mongomodels.user.findOne({username })
        if(!school||!admin||admin.role!='school admin'){
                return {
                    selfHandleResponse:{
                        "ok": false,
                        "message": "Invalid School or Admin",
                        "code":404
                    }
                }
        }
        school.admins.push(admin);
        await school.save() ;
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Admin Addded to school!",
                "code":200
            }
        }
    }
    async addClassroomToSchool({__longToken,__isAuthorised,__protect,__validate,classroomId,schoolId}){
        const body = {classroomId,schoolId};
        const classroom = await this.mongomodels.Classroom.findById(classroomId);
        const school =  await this.mongomodels.school.findOne({ _id: schoolId, admins: __longToken.userId });//to make sure this admin is assigned to this school
        if (!classroom || !school) {
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid School or Classoom!",
                    "code":404
                }
            }
        }

        classroom.school = school._id
        await classroom.save();
        const { __v,  ...schoolDetails } = school.toObject();
        return {
            selfHandleResponse:{
                "ok": true,
                "message": " ",
                "data":schoolDetails,
                "code":200
            }
        }
    }   
    async  removeClassroomFromSchool({__longToken,__isAuthorised,__protect,__validate, classroomId, schoolId }) {
    
            const classroom = await this.mongomodels.Classroom.findById(classroomId);
            const school = await this.mongomodels.school.findById(schoolId);

            if (!classroom || !school) {
                return result = {
                    selfHandleResponse:{
                        "ok": false,
                        "message": "Invalid School or Classoom!",
                        "code":404
                    }
                }
            }
    
            const index = school.classrooms.indexOf(classroomId);
            if (index !== -1) {
                school.classrooms.splice(index, 1);
            }
    
            await school.save();
    
            const {  __v, ...schoolDetails } = school.toObject();
    
            return {
                selfHandleResponse:{
                    "ok": true,
                    "message": " ",
                    "data":schoolDetails,
                    "code":200
                }
            }
    }
    async  deleteSchool({__longToken,__isAuthorised,__protect,__validateQuery }) {
        const queryParams = __validateQuery

        const school = await this.mongomodels.school.findById(__validateQuery.schoolId);


        if (!school) {
            return  {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid School ",
                    "code":404
                }
            }
        }
        const result = await  this.mongomodels.school.deleteOne({ _id:school._id});
 
        return  {
            selfHandleResponse:{
                "ok": true,
                "message": "Deleted Succsesfully",
                "code":200
            }
        }
    
}
async  getSchools({__longToken,__isAuthorised ,__protect}) {
    var result = {}
    if(__longToken.role=='superadmin'){
         result = await  this.mongomodels.school.find({ }).select('-__v').populate('classrooms').populate('admins').populate({ path: 'admins', select: '-password' })
    }
    else{
         result = await  this.mongomodels.school.find({ admins: __longToken.userId}).select('-__v').populate('classrooms').populate({ path: 'admins', select: '-password' })

    }
    return  {
        selfHandleResponse:{
            "ok": true,
            "message": " ",
            "data":result,
            "code":200
        }
    }

}
// async  getClassroomsInSchool({__longToken,__isAuthorised,__validate, __device,schoolId }) {
//     const result = await  this.mongomodels.school.find({ _id : schoolId,admins: __longToken.userId  }).select('classrooms').populate('classrooms').populate('admins')
//     return {
//         selfHandleResponse:{
//             "ok": true,
//             "message": "",
//             "code":200,
//             "data":result
//         }
//     }
// }
}
