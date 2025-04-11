import TWILIO from "../model/TWILIO.js";


export const createConfiguration = async (req, res, next) =>{
    try{
        const {accountsid, authtoken, mobileno} = req.body

        if(!accountsid || !authtoken || !mobileno) return res.status(400).json({message:"Please provide all required fields."})

        const newConfiguration = new TWILIO({
            accountsid,
            authtoken,
            mobileno
        })

        await newConfiguration.save()

        return res.status(200).json({message:"New twilio configuration created successfully",status:200})
    }catch(err){
        next(err)
    }
}

export const getConfiguration = async (req, res, next) =>{
    try{
       const configuration = await TWILIO.find().limit(1)

       return res.status(200).json({message:"Twilio Configuration retrived sucessfully.",data:configuration[0],status:200})
    }catch(err){
        next(err)
    }
}

export const updateConfiguration = async (req, res, next) =>{
    try{
       
        const {Id} = req.params
        
        if(!Id) return res.status(400).json({message:"Please provide Id."})

        const updatedConfigure = await TWILIO.findByIdAndUpdate(Id,{$set:{...req.body}})

        return res.status(200).json({message:"Configuration details updated.",status:200,data:updatedConfigure})

    }catch(err){
        next(err)
    }
}