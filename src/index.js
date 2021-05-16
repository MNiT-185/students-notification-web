require('dotenv').config()
const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const configSession = require('./config/session')
const ConnectDB = require('./config/connectDB')
const configViewEngine = require('./config/viewEngine')
const initRoutes = require('./routes/webStudent')
const adminRoutes = require('./routes/admin')
const facultyRoutes = require('./routes/faculty')
const userRoutes = require('./routes/user')

const PORT = process.env.port||'3000';

// Init app
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);
// Connect to MongoDB
ConnectDB()

// Enable post data for request
app.use(bodyParser.urlencoded({extended: true}))

// Config View Engine
configViewEngine(app)

// Enable flash message
app.use(flash());

//Config session
configSession(app)

//Config passport js
app.use(passport.initialize());
app.use(passport.session());

//Init all routes
initRoutes(app)

//Init admin routes
adminRoutes(app)

//Init falcuty routes
facultyRoutes(app)

//Init user routes
userRoutes(app)

io.on('connection', (socket) => {
    socket.on('addPost', msg => {
      io.emit('addPost', msg);
    });
    socket.on('addComment', (msg) => {
      io.emit('addComment', msg);
    });
});


http.listen(PORT,()=>{
    console.log(`Server is running at localhost:${PORT}`)
})