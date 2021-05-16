const express = require('express')
const adminController = require('../controllers/adminController')
const authController = require('../controllers/authController')
let router = express.Router()

/**
 * Init all routes
 * @param  app  from exactly express module
 */
 let adminRoutes = (app) =>{ 

    router.get('/',authController.checkLoggedIn,adminController.checkRole,adminController.getHome)
     //Congig Category
    router.get('/category',authController.checkLoggedIn,adminController.checkRole,adminController.getCategory)
    router.post('/category/add',authController.checkLoggedIn,adminController.checkRole,adminController.addCategory)
    router.post('/category/delete',authController.checkLoggedIn,adminController.checkRole,adminController.delCategory)
    router.post('/category/update',authController.checkLoggedIn,adminController.checkRole,adminController.updateCategory)

    //Config Falcuty
    router.get('/falcuty',authController.checkLoggedIn,adminController.checkRole,adminController.getFalcuty)
    router.post('/falcuty/add',authController.checkLoggedIn,adminController.checkRole,adminController.getAddFalcuty)
    router.post('/falcuty/delete',authController.checkLoggedIn,adminController.checkRole,adminController.getDeleteFalcuty)
    router.post('/falcuty/update',authController.checkLoggedIn,adminController.checkRole,adminController.getUpdateFalcuty)
    router.post('/falcuty/getInfoPost',authController.checkLoggedIn,adminController.checkRole,adminController.getInfoPost)
    //Config User
    router.get('/user',authController.checkLoggedIn,adminController.checkRole,adminController.getUsers)
    return app.use('/admin',router)
}
module.exports = adminRoutes