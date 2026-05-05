   const filemodel = require("../models/uplodeFile.model")
   const clodinary = require("../config/cloudinary");


   const uplodefileController = async (req,res)=>{

    try {
         const file = req.file;

         if(!file){
            return res.status(400).json({
                success:false,
                message:"file required no file uploded !"
            })
         }

         

         //if file are get uplode to cloudinary

         const result = await clodinary.uploader.upload(file.path,{
            resource_type:"auto",
            folder:"drive_documents"
         })
         // saved file data in db 
            const newfile = await filemodel.create({
                filename:result.original_filename,
                filrurl:result.secure_url,
                filetype:result.resource_type,
                filesize:result.bytes,
               
            })
            res.status(200).json({
                success:true,
                message:"file uplode successfully !",
                file:newfile
            })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: " internal server error....",
            errorMessage:error.message
        })
    }


   }

   module.exports = uplodefileController ;