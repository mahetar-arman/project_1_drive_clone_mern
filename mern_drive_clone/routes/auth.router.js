const AuthController = require('../controllers/auth.controllers')

const express = require("express");
const router = express.Router()

// htpp://localhost:5541/api/auth/register
router.post("/register",AuthController.registerController)
router.post("/login",AuthController.loginController)

// to genrate new accesstoken (get accesstoken from server )
htpp://localhost:5541/api/auth/refresh-token
router.get('/refresh-token',AuthController.refreshTokenController)


// logout -> http://localhost://5541/api/auth/log-out

router.post('/log-out' ,AuthController.logoutController)



// http://localhost:5541/api/auth//delete-user
router.post('/delete-user' ,AuthController.deleteController)


module.exports=router;


// semple data for register ------------
// {
// // {
// "username":"armmhetar",
// "email":"mahetman6@gmail.com",
// "password":"Aran2006@#"
// }
// // }