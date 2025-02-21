import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
   name:{
    type:String,
    required:true
   },
   address_type:{
      type:String,
      enum:['Home','Work','Other'],
      required:true
   },
   pincode:{
      type:String,
      required:true,
      match: [/^\d{6}$/, "Please enter a valid 6-digit pincode"],
   },
   house_no:{
      type:String,
      required:true
   },
   nearby_landmark:{
      type:String,
   },
   added_by:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
      refPath:"user"
   },
   added_by_model: {
      type: String,
      required: true,
      enum: ["user", "employee"], // Models that can be referenced
    },
},{timestamps:true})

export default mongoose.model('address',addressSchema)
