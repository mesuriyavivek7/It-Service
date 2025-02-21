import mongoose from "mongoose";
import validator from "validator"; // Import validator.js for email & phone validation

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
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
    mobileno: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, "any", { strictMode: true }); // Validates international numbers
            },
            message: "Invalid mobile number format. Please enter a valid mobile number."
        }
    }
}, { timestamps: true });

export default mongoose.model("employee", employeeSchema);
