const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
let router = express.Router()

/**
 * Init all routes
 * @param  app  from exactly express module
 */


let userRoutes = (app) =>{  
    router.put('/update-avatar',authController.checkLoggedIn, userController.updateAvatar)
    router.put('/update-info',authController.checkLoggedIn,userController.updateInfo)
    router.put('/updatePostUser',authController.checkLoggedIn,userController.updatePostUser)
    router.post('/postNewFeeds',authController.checkLoggedIn,userController.postNewFeeds)
    router.post('/postComment',authController.checkLoggedIn,userController.postComment)
    router.delete('/delPost',authController.checkLoggedIn,userController.delPost)
    router.delete('/delCmt',authController.checkLoggedIn,userController.delCmt)
    router.get('/detail/:id',authController.checkLoggedIn,userController.getListPostOfUsers)
    router.get('/postFaculty/all/:page',authController.checkLoggedIn,userController.getAllPostFaculty)
    router.get('/postFaculty/:idFaculty/:page',authController.checkLoggedIn,userController.getPostFaculty)
    router.get('/detailPost/:idPost',authController.checkLoggedIn,userController.getDetailPost)
    return app.use('/user',router)
};

module.exports = userRoutes