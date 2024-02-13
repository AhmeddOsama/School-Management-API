const bcrypt = require('bcrypt');

module.exports = class Clasroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['get=getClassroomsinSchools','get=getClassrooms','put=updateClassroomSchool','createClassroom','delete=deleteClassroom'];
        this.authorised          = ['school admin']
    }

    async createClassroom({__longToken,__isAuthorised,__validate,name}){
        const classroom = {name};


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


    async  deleteClassroom({__longToken,__isAuthorised,__validateQuery , classroomId }) {
        const params = __validateQuery
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
async updateClassroomSchool({__longToken,__isAuthorised,__validate,classroomId,schoolId}){
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
    if(classroom.school && classroom.school.toString()==school._id.toString()){
       return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "School Already Exists!",
                    "code":409
                }
            }
    }
    
    classroom.school = school._id
    await classroom.save();
    const { __v,  ...classroomDetails } = classroom.toObject();
    return {
        selfHandleResponse:{
            "ok": true,
            "message": " ",
            "data":classroomDetails,
            "code":200
        }
    }
}   

async  getClassroomsinSchools({__longToken,__isAuthorised }) {
    var result = {}
    const schools = await this.mongomodels.school.find({ admins: __longToken.userId }).select('_id');
    const schoolIds = schools.map(school => school._id);
    const classrooms = await this.mongomodels.Classroom.find({ school: { $in: schoolIds } });
    
    return  {
        selfHandleResponse:{
            "ok": true,
            "message": " ",
            "data":classrooms,
            "code":200
        }
    }

}
async  getClassrooms({__longToken,__isAuthorised }) {
    var result = {}
    const classrooms = await this.mongomodels.Classroom.find({ school: null })
    
    return  {
        selfHandleResponse:{
            "ok": true,
            "message": " ",
            "data":classrooms,
            "code":200
        }
    }

}
}
