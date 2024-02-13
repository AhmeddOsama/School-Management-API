const mongoose = require('mongoose');

module.exports = {
    'username': (data)=>{
        console.log('hi data',data)
        if(data.trim().length < 3){
            return false;
        }
        return true;
    },
    'objectId': (data)=>{
        const isValidId = mongoose.Types.ObjectId.isValid(data);
        if(!isValidId){
            throw new Error('Invalid ID Format')

        }
    },
}