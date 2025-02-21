import mongoose from "mongoose";

const salarySchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   }
},{timestamps:true})

export default mongoose.model('salary',salarySchema)
