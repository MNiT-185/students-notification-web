const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
let Schema = mongoose.Schema

let UserSchema = new Schema({
    username :{
        type : String,
        unique : true
    },
    avatar :{
        type  : String,
        default : "avatar-default.jpg"
    },
    isActive :{
        type : Boolean,
        default : true
    },
    role:{
        type : String,
        default : 'user',
    },
    local :{
        email:{
            type : String,
            trim : true
        },
        password : String,
        category :[
            {
                categoryId : String,
                categoryName : String
            }
        ],
    },
    google:{
        uid: String,
        token : String,
        email:{
            type : String,
            trim : true
        },
        gender : {
            type : String,
            default : "male"
        },
        class :{
            type : String,
            default : null
        },
        faculty :{
            type : String,
            default : null
        },
    },
    createdAt: {type: Number,default: Date.now},
    updatedAt: {type: Number,default: null},
    deletedAt: {type: Number,default: null}
});

UserSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    findByGoogleUid(uid){
        return this.findOne({"google.uid":uid}).exec();
    },
    findUserByEmail(email){
        return this.findOne({"local.email":email}).exec();
    },
    findUserById(id){
        return this.findById(id).exec();
    },
    getList(){
        return this.find({}).exec();
    },
    getListFalcuty(){
        return this.find({'role': 'falcuty'}).exec();
    },
    updateUser(id,item){
        return this.findByIdAndUpdate(id,item).exec()
    },
    updatePassword(id,hashedPassword){
        return this.findByIdAndUpdate(id,{"local.password":hashedPassword}).exec()
    },
    deleteUserByName(name){
        return this.findOneAndDelete({"username":name}).exec()
    }
}

UserSchema.methods = {
    comparePassword(password){
        return bcrypt.compareSync(password,this.local.password)
    }
}

module.exports = mongoose.model("user",UserSchema)