const mongoose = require("mongoose")

const userschema = mongoose.Schema({

    username: {
        type: String,
        require: [true, "username is required"],
        trim: true
    },

    email: {
        type: String,
        require: [true, "email is required"],
        trim: true,
        unique: true,
        minlength: [3, "email must be  at least 3 cherecter long "],
        lowercase: true
    },

    password: {
        type: String,
        require: [true, "password is required"],
        trim: true,
        minlength: [6, "password must be  at least 6 cherecter long "],
    },

     refreshToken: {
        type: String,
        default: null
    }

})

const usermodel = mongoose.model("users", userschema)

module.exports = usermodel;
