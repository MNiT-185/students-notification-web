const mongoose = require('mongoose')

let Schema = mongoose.Schema

let CommentSchema = new Schema({
    sender:{
        id:String,
        username:String,
        avatar:String
    },
    post: String,
    text: String,
    createdAt: {type: String,default: null},
    updatedAt: {type: Number,default: null},
    deletedAt: {type: Number,default: null}
});

module.exports = mongoose.model("comment",CommentSchema)