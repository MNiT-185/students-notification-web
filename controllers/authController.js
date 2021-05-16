const passport = require('passport')
const UserModel = require('../models/User')
const PostModel = require('../models/Post')
const CommentModel = require('../models/Comment')
const ManagePostModel = require('../models/ManagePosts')

let getLogin = (req,res)=>{
    //console.log("Login :" + req.session.user)
    //let errors = req.flash('errors')
    //console.log(req.flash('loginErrors'))
    let loginError = req.flash('loginErrors')
    //console.log(req.body)
    return res.render("auth/login",{loginError})
}

let getLogout = (req,res)=>{
    //console.log(req.user)
    req.logout()
    return res.redirect("/")
}

let checkLoggedIn = (req,res,next) =>{ 
    if(!req.isAuthenticated()){
        return res.redirect("/login")
    }
    next()
}

let checkRole = (req,res,next) =>{
    //console.log(req.user)
    if(req.user.role === 'user'){
        return res.redirect("/")
    }
    else if(req.user.role === 'falcuty'){
        return res.redirect("/")
    }else if(req.user.role === 'admin'){
        return res.redirect("/")
    }
    next()
}

let checkLoggedOut = (req,res,next) =>{
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    next()
}

let getIndexPage = async (req,res)=>{
    const user = req.user
    const listPost = await PostModel.getList()
    const posts = listPost.reverse()
    const listComment = await CommentModel.find({})
    const comments = listComment.reverse()
    const listPostFaculty = await ManagePostModel.find({})
    const postsFaculty = listPostFaculty.slice(-4).reverse()
    return res.render("user/index",{user,posts,comments,postsFaculty})
}

let getInfoUser = async (req,res) =>{
    let userId = req.user._id
    return res.status(200).send(userId);
}

module.exports = {
    getLogin : getLogin,
    getLogout : getLogout,
    getIndexPage : getIndexPage,
    checkLoggedIn : checkLoggedIn,
    checkLoggedOut : checkLoggedOut,
    checkRole : checkRole,
    getInfoUser : getInfoUser
}
