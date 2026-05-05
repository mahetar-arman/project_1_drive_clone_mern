const mongoose = require("mongoose");

const DBconnection = async()=>{

if (!process.env.MONGO_URI) {
    throw new Error("mongodb connnection uri  is not define in envirnmental variable (env) ");
}

try {
   await  mongoose.connect(process.env.MONGO_URI)
    console.log("✅ mongodb connected sucessfully ....")
} catch (error) {
    console.log("💥 mongodb connection error .... ", error)
}

}

module.exports = DBconnection