require('dotenv').config()
const mongoose = require('mongoose')
const bluebird = require('bluebird')

let connectDB = () =>{
    mongoose.Promise = bluebird; 

    DB_CONNECTION = "mongodb"
    DB_HOST = "localhost"
    DB_PORT = 27017
    DB_NAME ="student-notifications"
    DB_USERNAME = ""
    DB_PASSWORD = ""
    // mongodb://localhost:27017//student_notifications
    //let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`
    let URI = "mongodb+srv://thanh185:khapro@student-notifications.ndubx.mongodb.net/student-notifications?retryWrites=true&w=majority"
    return mongoose.connect(URI,{
    });
};
module.exports = connectDB;