import DEVICE from "../model/DEVICE.js";

//For create device 
export const createDevice = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        if(!mongoid || !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        if(userType!=='user'){
           return res.status(400).json({ message:"Only user can add device.", status:400})
        }

        const {device_type, brand, model_number, serial_number} = req.body

        if(!device_type || !brand || !model_number || !serial_number) return res.status(400).json({message:"Please provide all required fields",status:400})

        const newDevice = new DEVICE({
            device_type,
            brand,
            model_number,
            serial_number,
            added_by:mongoid
        })

        await newDevice.save()

        return res.status(200).json({message:"New device added successfully",data:newDevice,status:200})

    }catch(err){
        next(err)
    }
}


//For get all device by user
export const getAllDevice = async (req, res, next) =>{
    try{
        const {mongoid} = req

        if(!mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const devices = await DEVICE.find({added_by:mongoid})

        return res.status(200).json({message:'All device retrived',data:devices})
        
    }catch(err){
        next(err)
    }
}


//For updated device by user
export const updateDevice = async (req, res, next) =>{
    try{
        const {mongoid} = req

        if(!mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const updatedDevice = await DEVICE.findOneAndUpdate({added_by:mongoid},{$set:{...req.body}},{new:true})

        if(!updatedDevice) return res.status(404).json({message:'Device not found.',status:404})
       
        return res.status(200).json({message:"Device updated successfully",data:updatedDevice,status:200})

    }catch(err){

    }
}

//For delete device by user
export const deleteDevice = async (req, res, next) =>{
    try{
        const {mongoid} = req

        if(!mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type.", status: 400 });
        }

        const deletedDevice = await DEVICE.findOneAndDelete({added_by:mongoid})

        if(!deletedDevice) return res.status(404).json({message:"Device not found.",status:404})

        return res.status(200).json({message:"device deleted successfully.",status:200})
    }catch(err){
        next(err)
    }
}