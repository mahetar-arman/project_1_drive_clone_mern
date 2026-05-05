// ===========================register controler ================================

const usermodel = require("../models/user.model")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
    try {
        // get data from form or req.body
        console.log(req.body)

        const { username, email, password } = req.body;

     
        // check the username or email is alredy register or save in database 

        const existUser = await usermodel.findOne({ username }) || await usermodel.findOne({ email })

        //if user is alredy exist retuen message 

        if (existUser) {
            return res.status(400).json({
                message: 'user is alredy exist please login !'
            })
        }

        // if user is not exist so hash pasword and save user 

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await usermodel.create({
            username: username,
            email: email,
            password: hashPassword
        })

        return res.status(200).json({
            message: "user register succesfully ....",
            user: newUser
        })


    } catch (error) {
        return res.status(500).json({
            message: "internal server error ",
            errorMessage: error.message
        })
    }
}


const loginController = async (req, res) => {
    try {
        //get dta fromreq.body 

        const { username, password } = req.body;
        // find user is alredy register and saved in database or not 

        const user = await usermodel.findOne({ username });

        //if user not exist return message 
        if (!user) {
            res.status(400).json({
                message: " username and password are invalid !"
            })
            return res.redirect("/signup");
        }

        //if user is exist so check and compare password
        const isMatch = bcrypt.compare(password, user.password)

        if (!isMatch) {
            res.status(400).json({
                message: " username and password are invalid "
            })
        }

        //now password is match so genrate acces token and refresh token 

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" })

        const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })

        //save refresh token in database 
        user.refreshToken = refreshToken;
        await user.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,//set true in producyion
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).render("home");;


    } catch (error) {
        return res.status(500).json({
            message: "internal server error ",
            errorMessage: error.message
        })
    }
}


// now genrate a refreshToken controler . this token is use to re -create accessToken after evry 15 minint and server send it into clint side


const refreshTokenController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }

        // verify token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // check DB
        const user = await usermodel.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({
                message: "Invalid refresh token"
            });
        }

        // generate new access token
        const newAccessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({
            accessToken: newAccessToken
        });

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired refresh token"
        });
    }
};

//logout controller ---------------

const logoutController = async (req, res) => {
    try {
        // logout worked using refreshtoken &acesstoken so we need to remove token and its funcnality 

        // get refreshtoken from cookie 

        const refreshToken = req.cookies.refreshToken;
        
        if (refreshToken) {
            const user = await usermodel.findOne({ refreshToken });
            
            if (user) {
                user.refreshToken = null
                await user.save()
            }
        }
        
        
        res.clearCookie("refreshToken")
        
        
        return res.status(200).json({
            message: "Logout successful"
        });


    } catch (error) {
        return res.status(500).json({
            message: "internal server error"
        })
    }
}

const deleteController = async (req,res) =>{
    try{

   const refreshToken = req.cookies.refreshToken;

if (!refreshToken) {
    return res.status(401).json({
        message: "Refresh token missing"
    });
}

const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
);

const user = await usermodel.findByIdAndDelete(decoded.id); // ✅ fixed

if (!user) {
    return res.status(404).json({
        message: "User not found"
    });
}

res.clearCookie("refreshToken");

return res.status(200).json({
    message: "Account deleted successfully"
});



} catch (error) {
         return res.status(500).json({
            message: "internal server error ",
            errorMessage: error.message
        })
    }
}


module.exports = { registerController, loginController, refreshTokenController, logoutController, deleteController }