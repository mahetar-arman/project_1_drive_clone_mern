// this middleware is used to protect the routes and check the user is authenticated (login or not)

const jwt = require("jsonwebtoken")
 
const usermodel = require('../models/user.model')

const isUserLogedin = async (req,res, next) =>{

    try {
        const token = req.cookies.accessToken;


        if (!token) {
            return res.redirect("/login");
        }
        //validate token 

             const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

             if(decoded._id){
                next()
             }else{
             return res.redirect("/login");
             }

    } catch (error) {
         return res.redirect("/login");
    }

}

module.exports =isUserLogedin 