const jwt = require('jsonwebtoken');

module.exports.isloggedin = async (req,res,next)=>{
    if(req.cookies.token){
        try{
            let decoded = jwt.verify(req.cookies.token , process.env.JWT);
            req.user=decoded;
            next();
        }
        catch{
            return res.redirect('/');
        }
    }
    else{
        return res.redirect('/');
    }
}
module.exports.redirectIfLoggedin = async (req,res,next) =>{
    if(req.cookies.token){
        try{
            let decoded = jwt.verify(req.cookies.token, process.env.JWT);
            return res.redirect('/profile');
        }
        catch{
            next();
        }
    }
    else{
        next();
    }
}