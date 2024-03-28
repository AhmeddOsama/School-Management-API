const bcrypt = require('bcrypt');
const { result } = require('lodash');

module.exports = class School { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['put=addSchoolAdmin','createSchool','delete=deleteSchool','get=getSchools'];
        this.authorised          = ['superadmin','school admin']
        this.protection          = {
            createSchool:['superadmin'],
            getClassroomsInSchool:['school admin'],
            addSchoolAdmin:['superadmin'],
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
        if (school.admins.includes(admin._id)) {
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Admin already exists in the school!",
                    "code":400
                }
            }        
        }
        school.admins.push(admin._id);
        await school.save() ;
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "Admin Addded to school!",
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
         result = await  this.mongomodels.school.find({ }).select('-__v').populate('admins').populate({ path: 'admins', select: '-password' })
    }
    else{
         result = await  this.mongomodels.school.find({ admins: __longToken.userId}).select('-__v').populate({ path: 'admins', select: '-password' })

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
