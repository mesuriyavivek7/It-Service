import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    mobileno:{
        type:String,
        required:true
    },
    profilePic:{
        fileName:String,
        fileSize:String,
        filePath:String,
        fileType:String
    }
    
},{timestamps:true})


export default mongoose.model('user',userSchema)