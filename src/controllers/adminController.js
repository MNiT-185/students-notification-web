const {validationResult} =  require('express-validator')
const bcrypt = require('bcrypt')
const UserModel = require('../models/User')
const CategoryModel = require('../models/Categories')
const PostFalcuty = require('../models/ManagePosts')

let checkRole = (req,res,next) =>{ 
    if(req.user.role !== 'admin'){
        return res.status(500).send('Không có phân quyền')
    }
    next()
}

function capitalizeFirstLetter(string) {
    let sentence = string.toLowerCase();
    let titleCaseSentence = sentence.charAt(0).toUpperCase() + sentence.substring(1, sentence.length);
    return titleCaseSentence;
}

let getHome = async (req,res)=>{
    return res.redirect("/")
}

// Category
let getCategory = async (req,res)=>{
    let listCategory = await CategoryModel.getList()
    //console.log(listCategory)
    let success = req.flash('success') || ''
    let error = req.flash('error') || ''
    return res.render("admin/categoryManager",{listCategory,error,success})
}

let addCategory = async (req,res) =>{
    let nameCategory = capitalizeFirstLetter(req.body.nameCreate)
    //console.log(nameCategory)
    if(nameCategory){
        let check = await CategoryModel.findByName(nameCategory)
        if(!check){
            let newCategory = {
                name : nameCategory
            }
            try {
                await CategoryModel.createNew(newCategory)
                req.flash('success','Đã thêm chuyên mục ' + nameCategory)
                return res.redirect("/admin/category")
            } catch (error) {
                req.flash('error','Lỗi CSDL')
                return res.redirect("/admin/category") 
            }
        }else{
            req.flash('error','Chuyên mục đã tồn tại')
            return res.redirect("/admin/category")
        } 
    }else{
        req.flash('error','Vui lòng nhập chuyên mục')
        return res.redirect("/admin/category")
    }
    
}

let delCategory = async (req,res) =>{
    let item = req.body
    let name = item.deleteCategory
    try {
        await CategoryModel.deleteByName(name)
        await PostFalcuty.deleteMany({'categoryName' : name})
        let userUpdateCategory = await UserModel.find({'local.category.categoryName':name})
        userUpdateCategory.forEach( async e => {
            await UserModel.update({ _id: e._id },{"$pull": { "local.category": {"categoryName": name}}})
        });
        req.flash('success','Đã xóa chuyên mục ')
        return res.redirect("/admin/category")
    } catch (error) {
        req.flash('error','Lỗi CSDL')
        return res.redirect("/admin/category") 
    }
}

let updateCategory = async (req,res) =>{
    let item = req.body
    let name = capitalizeFirstLetter(item.nameCategory)
    let newName = capitalizeFirstLetter(item.newName)
    if(await CategoryModel.findByName(newName)){
        req.flash('error','Chuyên mục đã tồn tại')
        return res.redirect("/admin/category")
    }
    else{  
        try {
            let categgory = await CategoryModel.find({'name':name})
            console.log(categgory)
            let idCategory = categgory[0]._id
            console.log(idCategory)
            let userUpdateCategory = await UserModel.find({'local.category.categoryName':name})
            userUpdateCategory.forEach( async e => {
                await UserModel.updateMany({ "local.category.categoryId": idCategory },{ $set: { "local.category.$.categoryName": newName}})
            });
            await CategoryModel.updateByName(name,newName)
            await PostFalcuty.updateMany({'categoryName' : name},{'categoryName' : newName})
            req.flash('success','Đã cập nhật chuyên mục ')
            return res.redirect("/admin/category")
        } catch (error) {
            req.flash('error','Lỗi CSDL')
            return res.redirect("/admin/category") 
        }     
    }

    
}

//Falcuty
let getFalcuty = async (req,res)=>{
    let listCategory = await CategoryModel.getList()
    let listFalcuty = await UserModel.getListFalcuty()
    let success = req.flash('success') || ''
    let error = req.flash('error') || ''
    return res.render("admin/falcutyManager",{listFalcuty,listCategory,error,success})
}

let getAddFalcuty = async (req,res) =>{
    let {nameFalcutyCreate,emailFalcuty,activeFalcuty,categorySelect} = req.body
    const salt = bcrypt.genSaltSync(10);
    const hashed = await bcrypt.hashSync ('tdt1234', salt) ;  
    try {
        if(Array.isArray(categorySelect)){
            let categoryList = []
            categorySelect.forEach(u =>{
                let categoryItem = u.split('AND')
                let newCategory = {
                    categoryId : categoryItem[0],
                    categoryName : categoryItem[1]
                }
                categoryList.push(newCategory)
            })
            let newItem = {
                username : nameFalcutyCreate,
                isActive :activeFalcuty,
                role : 'falcuty',
                local :{
                    email:emailFalcuty,
                    password : hashed,
                    category : categoryList
                }, 
            }   
            await UserModel.createNew(newItem)     
        }else{
            let categoryItem = categorySelect.split('AND')
            let newItem = {
                username : nameFalcutyCreate,
                isActive :activeFalcuty,
                role : 'falcuty',
                local :{
                    email:emailFalcuty,
                    password : hashed,
                    category : {
                        categoryId : categoryItem[0],
                        categoryName : categoryItem[1]
                    }
                },
            }  
            await UserModel.createNew(newItem) 
        }
        req.flash('success','Đã thêm chuyên mục ')
        return res.redirect("/admin/falcuty")
    } catch (error) {
        req.flash('error','CSDL đã tồn tại')
        return res.redirect("/admin/falcuty") 
    }
    
}


let getDeleteFalcuty = async (req,res) =>{
    try {
        let facultyDel =await UserModel.deleteUserByName(req.body.deleteFalcuty)
        await PostFalcuty.deleteMany({'sender.falcutyId' : facultyDel._id})
        req.flash('success','Đã xóa phòng ban')
        return res.redirect("/admin/falcuty")
    } catch (error) {
        req.flash('error','CSDL đã tồn tại')
        return res.redirect("/admin/falcuty") 
    }
}

let getInfoPost = async (req,res) =>{
    try {
        let id = req.body.id
        let facultyInfo = await UserModel.findById(id).exec()
        let result = {
            data : facultyInfo
        }
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error);
    }
}

let getUpdateFalcuty = async (req,res) =>{
    let arrCategoryUpdate = req.body.categorySelectUpdate
    let arrUpdate = []
    if(arrCategoryUpdate){
        if(Array.isArray(arrCategoryUpdate)){
            arrCategoryUpdate.forEach(i => {
                let a = i.split('AND')
                let item = {
                    categoryId : a[0],
                    categoryName : a[1]
                }
                arrUpdate.push(item)  
            });
        }else{
            let a = arrCategoryUpdate.split('AND')
            let item = {
                categoryId : a[0],
                categoryName : a[1]
            }
            arrUpdate.push(item)
        }
    } 
    let {nameFalcutyUpdated,nameFalcutyUpdate,emailFalcutyUpdate,passwordFalcutyUpdate,categorySelectUpdate} = req.body
    try {
        if(passwordFalcutyUpdate){
            const salt = bcrypt.genSaltSync(10);
            const hashed = await bcrypt.hashSync (passwordFalcutyUpdate, salt) ;  
            await UserModel.findOneAndUpdate({'username': nameFalcutyUpdated},{'local.password':hashed})
        }
        if(categorySelectUpdate){
            await UserModel.findOneAndUpdate({'username': nameFalcutyUpdated},{'local.category':arrUpdate})
        }
        if(emailFalcutyUpdate){
            await UserModel.findOneAndUpdate({'username': nameFalcutyUpdated},{'local.email':emailFalcutyUpdate})
        }
        if(nameFalcutyUpdate){
            await UserModel.findOneAndUpdate({'username': nameFalcutyUpdated},{'username':nameFalcutyUpdate})
        }
        req.flash('success','Đã cập nhật thành công')
        return res.redirect("/admin/falcuty")
    } catch (error) {
        req.flash('error','Cập nhật thất bại. CSDL đã tồn tại')
        return res.redirect("/admin/falcuty")
    }
    
    
}

let getUsers = (req,res) =>{
    return res.render('admin/userManager')
}

module.exports = {
    getHome : getHome,
    getCategory : getCategory,
    addCategory : addCategory,
    delCategory : delCategory,
    updateCategory : updateCategory,
    getFalcuty : getFalcuty,
    getAddFalcuty : getAddFalcuty,
    getDeleteFalcuty : getDeleteFalcuty,
    getUsers : getUsers,
    checkRole : checkRole,
    getInfoPost : getInfoPost,
    getUpdateFalcuty : getUpdateFalcuty
}