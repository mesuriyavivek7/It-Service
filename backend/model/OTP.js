import mongoose from "mongoose";
import validator from "validator";

const otpSchema = new mongoose.Schema({
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
    otp:{
        type:String,
        required:true
    },
    name:{
        type:String,
    },
    createdAt: { type: Date, default: Date.now, expires: 180 } 
},{timestamps:true})

export default mongoose.model("otp",otpSchema)