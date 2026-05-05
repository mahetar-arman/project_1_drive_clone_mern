const mongoose = require("mongoose")

const fileSchema = mongoose.Schema({

    filename:{
        type:String,
        require:true
    },

    filrurl:{
        type:String,
        require:true
    },

    filetype:{
        type:String,
    },
    filesize:{
        type:Number
    },
    uplodeby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"    }
})

 const filemodel = mongoose.model("files",fileSchema)

 module.exports = filemodel;