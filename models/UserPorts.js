const mongoose = require('mongoose')
let Schema = mongoose.Schema

let PostSchema = new Schema({
    sender:{
        id:String,
        username:String,
        avatar : String
    },
    content: String,
    image : String,
    video : String,
    createdAt: {type: String,default: null},
    updatedAt: {type: String,default: null},
    deletedAt: {type: String,default: null}
});

PostSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    updateFile(id,item){
        return this.findByIdAndUpdate(id,item).exec()
    },
    getList(){
        return this.find({}).exec()
    },
    delPost(id){
        return this.findByIdAndDelete(id).exec()
    },
    getListPostById(id){
        return this.find({"sender.id":id}).exec()
    }
}

module.exports = mongoose.model("post",PostSchema)