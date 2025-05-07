import mongoose from "mongoose";

const empDesignation = new mongoose.Schema({
    designation_name:{
        type:String,
        required:true
    }
})

export default mongoose.model('empdesignation',empDesignation)