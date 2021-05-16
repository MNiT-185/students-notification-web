require('dotenv').config()
const mongoose = require('mongoose')
const bluebird = require('bluebird')

let connectDB = () =>{
    mongoose.Promise = bluebird; 

    DB_CONNECTION = process.env.DB_CONNECTION
    DB_HOST = process.env.DB_HOST
    DB_PORT = process.env.DB_PORT
    DB_NAME = process.env.DB_NAME
    DB_USERNAME = process.env.DB_USERNAME
    DB_PASSWORD = process.env.DB_PASSWORD
    // mongodb://localhost:27017//student_notifications
    let URI = `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`

    return mongoose.connect(URI,{
    });
};
module.exports = connectDB;