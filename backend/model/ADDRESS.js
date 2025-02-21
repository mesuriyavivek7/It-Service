import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   }
},{timestamps:true})

export default mongoose.model('address',addressSchema)
