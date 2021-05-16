const session = require('express-session')
const MongoStore = require('connect-mongo')


DB_CONNECTION = process.env.DB_CONNECTION
DB_HOST = process.env.DB_HOST
DB_PORT = process.env.DB_PORT
DB_NAME = process.env.DB_NAME

/**
 * Save session in mongodb
 */

let configSession = (app) =>{
    app.use(session({
        key: 'express.sid',
        secret: 'mySecrect',
        store: MongoStore.create({ 
            mongoUrl: `${DB_CONNECTION}://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
            autoReconnect : true,
            autoRemove:"native"
         }),
        resave: true,
        saveUninitialized : false,
        cookie:{
            maxAge: 1000 * 60 * 60 //60 minutes
        }
    }))
}

module.exports = configSession