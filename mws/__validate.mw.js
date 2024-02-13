module.exports = ({ meta, config, managers,validators }) =>{
    return async ({ req, res, next})=>{
        const moduleName = req.params.moduleName
        const fnName = req.params.fnName
        let result = await validators[moduleName][fnName](req.body);
        if(result)  return managers.responseDispatcher.dispatch(res, {ok: false, code:400, errors: result});
       
        next();
    }
}