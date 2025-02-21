import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobileno:{
        type:String,
        required:true
    }
},{timestamps:true})

export default mongoose.model("employee",employeeSchema)