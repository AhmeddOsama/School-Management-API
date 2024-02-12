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
        this.httpExposed         = ['createUser'];

    }

    async createUser({username, email, password,role}){
        const user = {username, email, password,role};
        console.log('user  ',user)
        // Data validation
        let result = await this.validators.user.createUser(user);
        if(result) return result;
        // console.log('asdas',this.mongomodels)
        const existingUser = await this.mongomodels.user.findOne({ username })
        if(existingUser){
            throw Error('User exists') //to handle errors
        }
        // Creation Logic
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password=hashedPassword
        let createdUser     = await this.mongomodels.user.create(user)
        const {_id, __v, password:pass, ...userDetails } = createdUser.toObject();
        let longToken       = this.tokenManager.genLongToken({userId: createdUser._id, userKey: createdUser.username ,role:createdUser.role});


        return {
            userDetails, 
            longToken 
        };
    }

}
