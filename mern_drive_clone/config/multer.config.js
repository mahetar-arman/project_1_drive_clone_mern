const multer = require("multer");



// in frontend side form teg attribute we add action and method and enctype="multipart/form-data" for file upload

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

module.exports = upload;