const multer =  require('multer')
const UserModel = require('../models/User')
const PostModel = require('../models/UserPorts.js')
const CommentModel = require('../models/Comment')
const FacultyPostModel = require('../models/ManagePosts')
const FacultyModel = require('../models/User')
const fsExtra = require('fs-extra')
const { findById } = require('../models/User')

let storageAvatar = multer.diskStorage({
    destination: (req,file,callback) =>{
        callback(null,"src/public/images")
    },
    filename : (req,file,callback) =>{
        let math = ["image/png","image/jpg","image/jpeg"]
        if(math.indexOf(file.mimetype) === -1){
            return callback("Kiểu file không hợp lệ",null)
        }
        let avatarName = `${Date.now()}-${file.originalname}`
        callback(null,avatarName)
    }
})

let avatarUploadFile = multer({
    storage: storageAvatar,
    limits: {
        fileSize : 1048576
    }
}).single("avatar");

let updateAvatar = (req,res)=>{
    //console.log("Login :" + req.session.user)
    avatarUploadFile  (req,res, async (error)=>{
        if(error ) {
            if(error.message){
                return res.status(500).send("Ảnh tối đa là 1MB")
            }
            return res.status(500).send(error)
        }
        //console.log(req.file) 
        try {
            let updateUserItem = {
                avatar : req.file.filename,
                updatedAt : Date.now()
            };
            
            //Update user
            let userUpdated = await UserModel.updateUser(req.user._id,updateUserItem)
            let commentUpdateAvatar = await CommentModel.updateMany({'sender.id':req.user._id},{'sender.avatar':req.file.filename})
            let postUpdateAvatar = await PostModel.updateMany({'sender.id':req.user._id},{'sender.avatar':req.file.filename})
            let listComment = await CommentModel.find({'sender.id':req.user._id})
            let listPost = await PostModel.find({'sender.id':req.user._id})
            //Remove user item
            await fsExtra.remove(`${"src/public/images"}/${userUpdated.avatar}`)
            let result = {
                message : "Cập nhật ảnh đại diện thành công",
                imageSrc : `/images/${req.file.filename}`,
                listComment : listComment,
                listPost : listPost
            }
            return res.status(200).send(result);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    })
}

let updateInfo = async (req,res) =>{
    try {
        let updateUserItem = req.body
        let userUpdate = await UserModel.findById(req.user._id)
        let genderUser =updateUserItem.gender || userUpdate.google.gender
        let classUser = updateUserItem.class || userUpdate.google.class
        let facultyUser = updateUserItem.faculty || userUpdate.google.faculty
        let itemUpdated = {
            uid: userUpdate.google.uid,
            token : userUpdate.google.token,
            email: userUpdate.google.email,
            gender : genderUser,
            class : classUser,
            faculty : facultyUser
        }
        await UserModel.findByIdAndUpdate(req.user._id,{'google':itemUpdated})
        let result = {
            message : "Cập nhật thông tin người dùng thành công"
        }
        return res.status(200).send(result);
    } catch (error) {
        //console.log(error)
        return res.status(500).send(error);
    }
}

let storageFile = multer.diskStorage({
    destination: (req,file,callback) =>{
        callback(null,"src/public/imgNewFeeds")
    },
    filename : (req,file,callback) =>{
        let avatarName = `${Date.now()}-${file.originalname}`
        callback(null,avatarName)
    }
})

let uploadFile = multer({
    storage: storageFile,
}).single("attachment");

let postNewFeeds = (req,res) =>{
    uploadFile  (req,res, async (error)=>{ 
        try {
            if(req.file && req.body.content !== undefined){
                let today = new Date()
                let currTime = today.getHours() + ":" + today.getMinutes() + " " + today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                let addPostItem = null
                addPostItem = {
                    sender:{
                        id: req.user._id,
                        username:req.user.username,
                        avatar : req.user.avatar
                    },
                    content: req.body.content,
                    image : req.file.filename,
                    createdAt : currTime
                }
                let newPost = await PostModel.createNew(addPostItem)
                let result = {
                    message : "Đăng thành công",
                    data : newPost,
                    idUser : req.user._id
                }
                return res.status(200).send(result);
            }
            if(req.file){
                let today = new Date()
                let currTime = today.getHours() + ":" + today.getMinutes() + " " + today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                let addPostItem = null
                addPostItem = {
                    sender:{
                        id: req.user._id,
                        username:req.user.username,
                        avatar : req.user.avatar
                    },
                    image : req.file.filename,
                    createdAt : currTime
                }
                let newPost = await PostModel.createNew(addPostItem)
                let result = {
                    message : "Đăng thành công",
                    data : newPost,
                    idUser : req.user._id
                }
                return res.status(200).send(result);
            }

            if(req.body.content &&  req.body.video){
                let today = new Date()
                let currTime = today.getHours() + ":" + today.getMinutes() + " " + today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                let addPostItem = {
                    sender:{
                        id: req.user._id,
                        username:req.user.username,
                        avatar : req.user.avatar
                    },
                    content: req.body.content,
                    video : req.body.video,
                    createdAt : currTime
                }
                let newPost = await PostModel.createNew(addPostItem)
                let result = {
                    message : "Đăng thành công",
                    data : newPost,
                    idUser : req.user._id
                }
                return res.status(200).send(result);
            }

            if(req.body.video){
                let today = new Date()
                let currTime = today.getHours() + ":" + today.getMinutes() + " " + today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                let addPostItem = {
                    sender:{
                        id: req.user._id,
                        username:req.user.username,
                        avatar : req.user.avatar
                    },
                    video : req.body.video,
                    createdAt : currTime
                }
                let newPost = await PostModel.createNew(addPostItem)
                let result = {
                    message : "Đăng thành công",
                    data : newPost,
                    idUser : req.user._id
                }
                return res.status(200).send(result);
            }

            if(req.body.content ){
                let today = new Date()
                let currTime = today.getHours() + ":" + today.getMinutes() + " " + today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
                let addPostItem = {
                    sender:{
                        id: req.user._id,
                        username:req.user.username,
                        avatar : req.user.avatar
                    },
                    content: req.body.content,
                    createdAt : currTime
                }
                let newPost = await PostModel.createNew(addPostItem)
                let result = {
                    message : "Đăng thành công",
                    data : newPost,
                    idUser : req.user._id
                }
                return res.status(200).send(result);
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send(error);
        }
    })
}

let delPost = async (req,res) =>{
    try {
        let idPost = req.body.id
        await CommentModel.deleteMany({"post":idPost}).exec()
        let post = await PostModel.findByIdAndDelete(idPost).exec()
        let image = post.image
        if(image){
            let destinationImg = 'src/public/imgNewFeeds/' + image
            fsExtra.remove(destinationImg, err => {
                if (err) return console.error(err)
            })
        }
        let result = {
            message : "Đã xóa New Feeds",
            idPost : idPost
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }  
}

let getListPostOfUsers = async (req,res) =>{
    let idP = req.params.id
    let posts = await PostModel.getListPostById(idP)
    let user = req.user
    let userPost = await UserModel.findById(idP)
    const listComment = await CommentModel.find({})
    const comments = listComment.reverse()
    return res.render('user/listPostOfUser',{user,posts,userPost,comments})
}

let postComment = async (req,res) =>{
    try {
        let {idPost,idUser,content} = req.body
        //console.log(idPost)
        let userPostComment = await UserModel.findById(idUser)
        let avatarUser = userPostComment.avatar
        let nameUser = userPostComment.username
        let today = new Date()
        let currTime = today.getHours() + ":" + today.getMinutes() + " " + today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        let commentItem = {
            sender : {
                id : idUser,
                username : nameUser,
                avatar : avatarUser
            },
            post: idPost,
            text : content,
            createdAt :  currTime
        }
        let post = await CommentModel.create(commentItem)
        let result = {
            message : 'Comment thành công',
            data : post
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}


let getAllPostFaculty = async (req,res) => {
    let facultyList = await FacultyModel.getListFalcuty()
    let user = req.user
    var perPage = 10
    var page = req.params.page || 1
    let title = "Tất cả thông báo"
    await FacultyPostModel
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, listPost) {
            FacultyPostModel.count().exec(function(err, count) {
                if (err) return next(err)
                return res.render('user/allPostOfFaculty', {
                    user : user,
                    listPost: listPost,
                    facultyList :facultyList,
                    current: page,
                    title : title,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
}

let getDetailPost = async (req,res) => {
    let {idPost} = req.params
    let posts = await FacultyPostModel.findById(idPost)
    let user = req.user
    return res.render('user/detailPost',{user,posts})
}

let delCmt = async (req,res) =>{
    try {
        let idPost = req.body.id
        let cmtDel = await CommentModel.findByIdAndDelete(idPost).exec()
        let result = {
            message : "Đã xóa Cmt",
            data : cmtDel
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }  
}

let updatePostUser = (req,res) =>{
    uploadFile  (req,res, async (error)=>{ 
        let {idPost,content,video} = req.body
        //console.log(req.file)
        if(req.file && content){
            let item = await PostModel.findByIdAndUpdate(
                idPost,
                {
                    'content' : content,
                    'image' : req.file.filename,
                    'video' : null,
                }
            )
            if(item.image){
                let destinationImg = 'src/public/imgNewFeeds/' + item.image
                fsExtra.remove(destinationImg, err => {
                    if (err) return console.error(err)
                })
            }
            let updatedPost = await PostModel.findById(idPost)
            let result = {
                message : "Sửa thành công",
                data : updatedPost,
                idUser : req.user._id
            }
            return res.status(200).send(result);
        }
        if(content && video){
            let item = await PostModel.findByIdAndUpdate(
                idPost,
                {
                    'content' : content,
                    'image' : null,
                    'video' : video,
                }
            )
            if(item.image){
                let destinationImg = 'src/public/imgNewFeeds/' + item.image
                fsExtra.remove(destinationImg, err => {
                    if (err) return console.error(err)
                })
            }
            let updatedPost = await PostModel.findById(idPost)
            let result = {
                message : "Sửa thành công",
                data : updatedPost,
                idUser : req.user._id
            }
            return res.status(200).send(result);
        }
        if(video) {
            let item = await PostModel.findByIdAndUpdate(
                idPost,
                {
                    'content' : null,
                    'image' : null,
                    'video' : video,
                }
            )
            if(item.image){
                let destinationImg = 'src/public/imgNewFeeds/' + item.image
                fsExtra.remove(destinationImg, err => {
                    if (err) return console.error(err)
                })
            }
            let updatedPost = await PostModel.findById(idPost)
            let result = {
                message : "Sửa thành công",
                data : updatedPost,
                idUser : req.user._id
            }
            return res.status(200).send(result);
        }
        if(req.file) {
            let item = await PostModel.findByIdAndUpdate(
                idPost,
                {
                    'content' : null,
                    'image' : req.file.filename,
                    'video' : null,
                }
            )
            if(item.image){
                let destinationImg = 'src/public/imgNewFeeds/' + item.image
                fsExtra.remove(destinationImg, err => {
                    if (err) return console.error(err)
                })
            }
            let updatedPost = await PostModel.findById(idPost)
            let result = {
                message : "Sửa thành công",
                data : updatedPost,
                idUser : req.user._id
            }
            return res.status(200).send(result);
        }
        if(content) {
            let item = await PostModel.findByIdAndUpdate(
                idPost,
                {
                    'content' : content,
                    'image' : null,
                    'video' : null
                }
            )
            if(item.image){
                let destinationImg = 'src/public/imgNewFeeds/' + item.image
                fsExtra.remove(destinationImg, err => {
                    if (err) return console.error(err)
                })
            }
            let updatedPost = await PostModel.findById(idPost)
            let result = {
                message : "Sửa thành công",
                data : updatedPost,
                idUser : req.user._id
            }
            return res.status(200).send(result);
        }
    })
}

let getPostFaculty = async (req,res) =>{
    let facultyList = await FacultyModel.getListFalcuty()
    let user = req.user
    var perPage = 10
    var page = req.params.page || 1
    let item = await FacultyModel.findById(req.params.idFaculty)
    let title = item.username
    await FacultyPostModel
        .find({'sender.falcutyId' :req.params.idFaculty })
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, listPost) {
            FacultyPostModel.count().exec(function(err, count) {
                if (err) return next(err)
                return res.render('user/allPostOfFaculty', {
                    user : user,
                    listPost: listPost,
                    facultyList :facultyList,
                    current: page,
                    title : title,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
}
    

module.exports = {
    updateAvatar : updateAvatar,
    updateInfo : updateInfo,
    postNewFeeds : postNewFeeds,
    delPost : delPost,
    getListPostOfUsers : getListPostOfUsers,
    postComment : postComment,
    getAllPostFaculty : getAllPostFaculty,
    getDetailPost : getDetailPost,
    delCmt : delCmt,
    updatePostUser : updatePostUser,
    getPostFaculty : getPostFaculty
}