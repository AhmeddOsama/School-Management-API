module.exports = ({ meta, config, managers }) =>{
    return ({ req, res, next})=>{
        const moduleName = req.params.moduleName
        const authorised = managers[moduleName].authorised
        if(!req.decoded||!authorised.includes(req.decoded.role)){
            return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized'});
        }
        next();
    }
}