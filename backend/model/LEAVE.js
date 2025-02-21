import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   }
},{timestamps:true})

export default mongoose.model('leave',leaveSchema)
