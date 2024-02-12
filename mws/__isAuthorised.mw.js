module.exports = ({ meta, config, managers }) =>{
    return ({ req, res, next})=>{
        const authorised = managers.classroom.authorised
        // console.log('req.decoded' , req.decoded)
        if(!req.decoded||!authorised.includes(req.decoded.role)){
            return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized'});
        }
        next();
    }
}