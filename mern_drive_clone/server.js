const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser")

dotenv.config();
const PORT = process.env.PORT


    if (!process.env.PORT) {
        throw new Error("port is not define in envirnmental variable (env) ");
    }

const DBconnection = require("./config/dbconnection")
DBconnection();


const app = express()

app.use(cookieParser())


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const Authrouter = require('./routes/auth.router')
const filerouter = require('./routes/file.router')
const isUserLogedin = require('./middleware/auth.middleware')


//routers for authentication 

app.use('/api/auth',Authrouter)
app.use("/api/file",filerouter)
//public routers


app.get("/register", (req, res) => {
    res.render("register")
})

    app.get("/login", (req, res) => {
        res.render("login")
    })

    app.get("/home",isUserLogedin, (req, res) => {
    res.render("home")
})

// set up template engine
app.set("view engine", "ejs")   
//for css and js files
app.use(express.static("public"))

app.get("/helth", (req, res) => {
    res.send("hello server is running ....")
})




app.listen(PORT, () => {
    console.log(`🚀 server is running on port ${PORT}`)
})