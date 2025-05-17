import mongoose from "mongoose";
import validator from "validator";

const employeeSchema = new mongoose.Schema({
    employeeCode:{
        type:String,
        required:true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: "Invalid email format. Please enter a valid email."
        }
    },
    availability: {
        type: Boolean,
        default: true
    },
    branch:{
        type:String,
        required:true
    },
    mobileno: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, "any", { strictMode: true });
            },
            message: "Invalid mobile number format. Please enter a valid mobile number."
        }
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true
    },
    HireDate: {
        type: Date,
        default: new Date()
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'empdepartment',
        required: true
    },
    designationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'empdesignation',
        required: true
    },
    reportingToId: {
        type: String,
    },
    salary: {
        type: String,
        required: true
    },
    adharCard: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[2-9]{1}[0-9]{11}$/.test(value); // 12-digit Aadhar number starting from 2-9
            },
            message: "Invalid Aadhar number format. It must be a 12-digit number."
        }
    },
    panCard: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value);
            },
            message: "Invalid PAN card format. It must be in format 'ABCDE1234F'."
        }
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
    },
    area: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^[1-9][0-9]{5}$/.test(value); // 6-digit PIN starting from 1-9
            },
            message: "Invalid PIN code. It must be a 6-digit number."
        }
    },
    maritalStatus: {
        type: String,
        enum: ["Single", "Married", "Divorced", "Widowed"],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: true
    },
    emergencyNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isMobilePhone(value, "any", { strictMode: true });
            },
            message: "Invalid emergency contact number."
        }
    },
    emergencyContactPerson: {
        type: String,
        required: true
    },
    assignedIssues: [{ type: mongoose.Schema.Types.ObjectId, ref: "issue" }],
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("employee", employeeSchema);
