const express = require('express')
const falcutyController = require('../controllers/falcutyController')
const authController = require('../controllers/authController')
const userValid = require('../validation/userValidation')
let router = express.Router()

/**
 * Init all routes
 * @param  app  from exactly express module
 */

 let falcutyRoutes = (app) =>{  
    //Home Faculty
    router.get('/',authController.checkLoggedIn,falcutyController.checkRole,falcutyController.checkRole,falcutyController.getHome)
    //Pagination List Post
    router.get('/:nameCategory/:page',authController.checkLoggedIn,falcutyController.checkRole,falcutyController.getListPostByCategory)
    //Post
    router.get('/:idPost',authController.checkLoggedIn,falcutyController.checkRole,falcutyController.getDetailPost)
    router.post('/addPost',authController.checkLoggedIn,falcutyController.checkRole,falcutyController.addPostByCategory)
    router.delete('/deletePost',authController.checkLoggedIn,falcutyController.checkRole,falcutyController.deletePost)
    router.put('/updatePost',authController.checkLoggedIn,falcutyController.checkRole,falcutyController.updatePost)
    //Update Password
    router.put('/update-info',authController.checkLoggedIn,falcutyController.checkRole,userValid.updatePassword,falcutyController.updatePassword)  
    //Delete
    router.delete('/deletePost',authController.checkLoggedIn,falcutyController.checkRole,falcutyController.deletePost)
    return app.use('/faculty',router)
};

module.exports = falcutyRoutes