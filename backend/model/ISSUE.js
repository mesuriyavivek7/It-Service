import mongoose from 'mongoose'

const issueSchema = new mongoose.Schema({
    issue_description:{
        type:String,
        required:true
    },
    images:[
        {
            fileName:{type:String},
            filePath:{type:String},
            fileSize:{type:Number},
            fileType:{type:String}
        }
    ],
    device:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'device',
        required:true
    },
    device_snapshots:{
        type:String 
    },
    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address',
        required:true
    },
    address_snapshots:{
       type:String
    },
    time:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'time',
        required:true
    },
    time_snapshots:{
       type:String
    },
    date:{
        type:Date,
        required:true
    },
    added_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    user_snapshots:{
        type:String
    },
    status:{
        type:String,
        enum:['Pending','Resolved','Canceled'],
        default:"Pending",
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'service',
        required:true
    },
    service_snapshots:{
        service_name:String,
        price:Number
    },
    assignedEmployee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "employee", 
        default: null 
    }
},{timestamps:true})

export default mongoose.model('issue',issueSchema)