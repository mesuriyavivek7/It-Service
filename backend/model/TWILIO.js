import mongoose from 'mongoose'


const twilioSchema = new mongoose.Schema({
    accountsid:{
        type:String,
        required:true
    },
    authtoken:{
        type:String,
        required:true
    },
    mobileno:{
        type:String,
        required:true
    }
})


export default mongoose.model("twilio",twilioSchema)