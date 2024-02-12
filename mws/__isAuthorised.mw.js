module.exports = ({ meta, config, managers }) =>{
    return ({ req, res, next})=>{
        console.log('decoded ',managers)
        next();
    }
}