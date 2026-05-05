const express = require("express");
const router = express.Router()

const uplodefileController = require("../controllers/uplode.controller")
const uploader = require("../config/multer.config")


// http://localhost:5541/api/file/upload
router.post("/upload", uploader.single("file"),uplodefileController);

module.exports= router