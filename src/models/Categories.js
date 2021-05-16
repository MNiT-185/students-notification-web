const mongoose = require('mongoose')

let Schema = mongoose.Schema

let CategoriesSchema = new Schema({
    name : {
        type: String
    },
    createdAt: {type: Number,default: Date.now},
    updatedAt: {type: Number,default: null}
});

CategoriesSchema.statics = {
    createNew(item){
        return this.create(item);
    },
    getList(){
        return this.find({}).exec();
    },
    findByName(name){
        return this.findOne({name : name}).exec();
    },
    deleteById(id){
        return this.findByIdAndDelete(id).exec()
    },
    updateById(id,name){
        return this.findByIdAndUpdate(id,{name : name}).exec()
    },
    deleteByName(name){
        return this.findOneAndDelete({name:name}).exec()
    },
    updateByName(name,newName){
        return this.findOneAndUpdate({name : name},{name : newName}).exec()
    },
}

module.exports = mongoose.model("category",CategoriesSchema)