const mongoose=require('mongoose');


const postSchema=mongoose.Schema({
    key: {
        type:String,
        required:true
    },
    value: {
        type:Date,
        required:true
    }
});

module.exports = mongoose.model('schema' , postSchema);