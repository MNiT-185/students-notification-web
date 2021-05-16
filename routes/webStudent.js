const express = require('express')
const passport = require('passport')
const authController = require('../controllers/authController')
const initPassportGoogle = require('./../controllers/passportController/google')
const initPassportLocal = require('./../controllers/passportController/local')



let router = express.Router()
initPassportLocal()
initPassportGoogle()


/**
 * Init all routes
 * @param  app  from exactly express module
 */

let initRoutes = (app) =>{  
    router.get('/',authController.checkLoggedIn,authController.getIndexPage)
    router.get('/getIdUserCurr',authController.checkLoggedIn,authController.getInfoUser)
    router.get('/logout',authController.checkLoggedIn,authController.getLogout)
    router.get('/login',authController.checkLoggedOut,authController.getLogin)
    router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));
    router.get('/google/callback',passport.authenticate('google',{failureRedirect: '/login',successFlash:true,failureFlash:true }),authController.checkRole),
    router.post('/loginLocal',passport.authenticate('local',{failureRedirect: '/login',successFlash:true,failureFlash:true }),authController.checkRole)  
    return app.use('/',router)
};

module.exports = initRoutes