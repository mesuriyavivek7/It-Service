import mongoose from "mongoose";
import validator from "validator";

const loginmappingSchema = new mongoose.Schema({
    mongoid:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        refPath:"userType"
    },
    mobileno:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, "any", { strictMode: true });
            },
            message: "Invalid mobile number format.",
        },
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