import mongoose from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
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
    profile_pic:{
        fileName: String,
        fileSize: String,
        filePath: String,
        fileType: String
    }
},{timestamps:true})

export default mongoose.model('admin',adminSchema)