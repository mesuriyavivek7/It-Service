import validator from "validator";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileno: {
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
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Converts email to lowercase
        trim: true, // Removes whitespace
        validate: {
            validator: function (value) {
                return validator.isEmail(value); // Checks if it's a valid email
            },
            message: "Invalid email format. Please enter a valid email."
        }
    },
    profilePic: {
        fileName: String,
        fileSize: String,
        filePath: String,
        fileType: String
    }
}, { timestamps: true });

export default mongoose.model('user', userSchema);
