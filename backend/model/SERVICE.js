import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
    service_name:{
        type:String,
        required:true,
        trim: true, 
    },
    service_image:{
      fileName: { type: String, required: true },
      filePath: { type: String, required: true },
      fileSize: { type: Number, required: true },
      fileType: { type: String, required: true },
    },
    price:{
        type:Number,
        required:true,
        min: [0, "Price cannot be negative"]
    },
    added_by:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'admin'
    }
},{timestamps:true})

export default mongoose.model('service',serviceSchema)