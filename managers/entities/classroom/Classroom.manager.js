const bcrypt = require('bcrypt');

module.exports = class Clasroom { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.httpExposed         = ['get=getClassroomsinSchools','get=getClassrooms','put=addClassroomToSchool','put=removeClassroomFromSchool','createClassroom','put=addStudentToClassrooom','delete=deleteClassroom'];
        this.authorised          = ['school admin']
    }

    async createClassroom({__longToken,__isAuthorised,name}){
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

    async addStudentToClassrooom({__longToken,__isAuthorised,classroomId,studentId}){
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
                    "code":404
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
async addClassroomToSchool({__longToken,__isAuthorised,__validate,classroomId,schoolId}){
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
async  removeClassroomFromSchool({__longToken,__isAuthorised,__validate, classroomId, schoolId }) {

        const classroom = await this.mongomodels.Classroom.findById(classroomId);
        const school = await this.mongomodels.school.findOne({ _id: schoolId, admins: __longToken.userId });
        
        if (!classroom || !school || classroom.school.toString()!=school._id.toString()) {
            return   {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid School or Classoom!",
                    "code":404
                }
            }
        }

        await this.mongomodels.Classroom.updateOne({ _id: classroomId }, { $unset: { school: 1 } });
        const updatedClassroom = await this.mongomodels.Classroom.findById(classroomId);

        const {  __v, ...classroomDetails } = updatedClassroom.toObject();

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
