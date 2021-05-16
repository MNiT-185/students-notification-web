const mongoose = require('mongoose')

let Schema = mongoose.Schema

let ManagePostsSchema = new Schema({
    sender:{
        falcutyId:String,
        name:String
    },
    categoryName : String,
    title: String,
    text: String,
    createdAt: {type: String,default: null},
    updatedAt: {type: Number,default: null}
});


ManagePostsSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    updateFile(id,item){
        return this.findByIdAndUpdate(id,item).exec()
    },
    findUserByName(name,categoryName){
        return this.find({"sender.name":name,"categoryName":categoryName}).exec();
    },
}

module.exports = mongoose.model("managepost",ManagePostsSchema)