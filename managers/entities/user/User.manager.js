const bcrypt = require('bcrypt');

module.exports = class User { 

    constructor({utils, cache, config, cortex, managers, validators, mongomodels }={}){
        this.config              = config;
        this.cortex              = cortex;
        this.validators          = validators; 
        this.mongomodels         = mongomodels;
        this.tokenManager        = managers.token;
        this.usersCollection     = "users";
        this.userExposed         = ['createUser'];
        this.httpExposed         = ['login','createUser','delete=deleteUser','get=getUserSchools'];

    }

    async createUser({__validate,username, email, password,role}){
        const user = {username, email, password,role};
        // Data validation
        let result = await this.validators.user.createUser(user);
        if(result) return result;
        // console.log('asdas',this.mongomodels)
        const existingUser = await this.mongomodels.user.findOne({ username })
        if(existingUser){
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "User Already Exists",
                    "code":409
                }
            }           }
        // Creation Logic
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password=hashedPassword
        let createdUser     = await this.mongomodels.user.create(user)
        const {_id, __v, password:pass, ...userDetails } = createdUser.toObject();
        let longToken = this.tokenManager.genLongToken({userId: createdUser._id, userKey: createdUser.username ,role:createdUser.role});


        return  {
            selfHandleResponse:{
                "ok": true,
                "message": "",
                "data":{userDetails,longToken},
                "code":200
            }
        }    
    }

    async deleteUser({__longToken,__validateQuery}){
        const decoded = __longToken
        const queryParams = __validateQuery
        if(decoded.userKey!=queryParams.username){
            return  {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Forbidden",
                    "data":"",
                    "code":403
                }
            }         }
        const result = await  this.mongomodels.user.deleteOne({ _id: decoded.userId });
        return {
            
        }

    }
    
    async login({username,password}){
        const body = {username,password}
        let result = await this.validators.user.login(body);
        if(result) return result;
        
        const user = await  this.mongomodels.user.findOne({ username });
        if(!user){
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Username or Password",
                    "code":404
                }
            }        
        }
        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword){
            return {
                selfHandleResponse:{
                    "ok": false,
                    "message": "Invalid Username or Password",
                    "code":404
                }
            }
        }

        let longToken= this.tokenManager.genLongToken({userId: user._id, userKey: user.username ,role:user.role});
        return {
            longToken 
        };

    }
    async getUserSchools({__longToken}){
        const decoded = __longToken
        const schools = await this.mongomodels.school.find({ admins: decoded.userId });        
        return {
            selfHandleResponse:{
                "ok": true,
                "message": "",
                "data":schools,
                "code":200
            }
        }

    }
}
