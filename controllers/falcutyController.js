const {validationResult} =  require('express-validator')
const multer =  require('multer')
const bcrypt = require('bcrypt')
const UserModel = require('../models/User')
const FacultyPostModel = require('../models/ManagePosts')
const { copySync } = require('fs-extra')

let updatePassword = async (req,res) =>{ 
    let errorArr = []
    let validtionErrors = validationResult(req)
    if(!validtionErrors.isEmpty()){
        let errors = Object.values(validtionErrors.mapped())
        errors.forEach(item => {
            errorArr.push(item.msg)
        });
        return res.status(500).send(errorArr[0])
    }    
    try {
        let updateFalcutyItem = req.body
        let falcutyCurrent = req.user
        let checkPassword = await falcutyCurrent.comparePassword(updateFalcutyItem.password)
        if(!checkPassword){
            return res.status(500).send("Mật khẩu không trùng khớp.")
        }
        const salt = bcrypt.genSaltSync(10);
        const hashed = await bcrypt.hashSync (updateFalcutyItem.newPassword, salt) ; 
        await UserModel.updatePassword(falcutyCurrent._id,hashed)
        let result = {
            message : "Thay đổi mật khẩu thành công"
        }
        return res.status(200).send(result);
        /*console.log("TT update : "+updateFalcutyItem.password)
        console.log("TT current :"+falcutyCurrent.local.password)
        console.log("SS password : "+checkPassword)*/
    } catch (error) {
        //console.log(error)
        return res.status(500).send(error);
    }
}

let getHome = (req,res)=>{
    //console.log("Login :" + req.session.user)
    let user = req.user
    return res.render("faculty/index",{user})
}

let getListPostByCategory = async (req,res)=>{
    let categoryName = req.params.nameCategory
    let user = req.user
    var perPage = 10
    var page = req.params.page || 1
    FacultyPostModel
        .find({"sender.name":req.user.username,"categoryName":categoryName})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, listPost) {
            FacultyPostModel.count().exec(function(err, count) {
                if (err) return next(err)
                return res.render('faculty/listPosts', {
                    user : user,
                    listPost: listPost,
                    categoryName : categoryName,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })

    //return res.render('faculty/listPosts',{user,arrPost})
}


let addPostByCategory = async (req,res)=>{
    try {
        let today = new Date()
        let currTime = (today.getHours()+7) + ":" + today.getMinutes() + " " + today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
        let item = req.body
        let addItem = {
            sender:{
                falcutyId:req.user._id,
                name:req.user.username
            },
            title : item.title,
            categoryName : item.category,
            text: item.content,
            createdAt : currTime
        }
        let post = await FacultyPostModel.createNew(addItem)
        let result = {
            message : "Thêm thông báo thành công",
            data : post
        }
        
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

let getDetailPost = async (req,res) => {
    let {idPost} = req.params
    let posts = await FacultyPostModel.findById(idPost)
    let user = req.user
    return res.render('faculty/detailPost',{user,posts})
}

let checkRole = (req,res,next) =>{ 
    if(req.user.role !== 'falcuty'){
        return res.status(500).send('Không có phân quyền')
    }
    next()
}

let deletePost = async (req,res) => {
    try {
        let idPost = req.body.idPostDelete
        let facultyDeleted = await FacultyPostModel.findByIdAndDelete(idPost).exec()
        let result = {
            message : "Đã xóa New Feeds",
            data : facultyDeleted
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }  
}

let updatePost = async (req,res) => {
    try {
        let {id,title,content,category} = req.body
        //console.log(req.body)
        if(title){
            await FacultyPostModel.findByIdAndUpdate(id,{'title':title})
        }
        if(content){
            await FacultyPostModel.findByIdAndUpdate(id,{'text':content})
        }
        if(category){
            await FacultyPostModel.findByIdAndUpdate(id,{'categoryName':category})
        }
        let data = await FacultyPostModel.findById(id)
        let result = {
            message : "Đã sửa New Feeds",
            data : data
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}


module.exports = {
    getHome : getHome,
    updatePassword : updatePassword,
    getListPostByCategory: getListPostByCategory,
    addPostByCategory : addPostByCategory,
    getDetailPost : getDetailPost,
    deletePost : deletePost,
    updatePost : updatePost,
    checkRole : checkRole
}