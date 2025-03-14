import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
   leave_type:{
    type:String,
    enum:['Privilege','Sick'],
    required:true
   },
   from:{
      type:Date,
      required:true
   },
   to:{
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= this.from; // ✅ Ensures `to` is after `from`
        },
        message: "End date must be after or equal to start date.",
      },
   },
   status:{
     type:String,
     enum:['Pending','Approved','Rejected'],
     default:"Pending"
   },
   added_by:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'employee',
      required:true
   },
   handover_by:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'admin',
      required:true
   },
   comments:{
      type:String,
   }
},{timestamps:true})

export default mongoose.model('leave',leaveSchema)
