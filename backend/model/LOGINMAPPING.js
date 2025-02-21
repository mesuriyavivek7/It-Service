import mongoose from "mongoose";

const loginmappingSchema = new mongoose.Schema({
    mongoid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:"userType"
    },
    mobileno:{
        type:String,
        required:true,
    },
    email:{
       type:String
    },
    password:{
        type:String
    },
    userType:{
        type:String,
        enum:['user','employee','admin']
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})


export default mongoose.model('loginmapping',loginmappingSchema)