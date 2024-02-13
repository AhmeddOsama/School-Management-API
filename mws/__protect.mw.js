module.exports = ({ meta, config, managers }) =>{
    return async ({ req, res, next})=>{
        const moduleName = req.params.moduleName
        const fnName = req.params.fnName
        const protection = managers[moduleName].protection[fnName]
        if(!protection||protection.includes(req.decoded.role)){
            next()
        }
        else{
            return managers.responseDispatcher.dispatch(res, {ok: false, code:401, errors: 'unauthorized'});
        }

}
}