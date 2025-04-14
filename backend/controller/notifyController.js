import NOTIFY from "../model/NOTIFY.js";



export const getNotification = async (req, res, next) =>{
    try{
        const {mongoid} = req

        if(!mongoid) return res.status(400).json({message:"Unauthorized request: Missing user ID.",status:400})

        const notifications = await NOTIFY.find({to:mongoid,isRead:false}).sort({createdAt: -1})

        return res.status(200).json({message:"Notification retrived successfully.",status:200,data:notifications})
    }catch(err){
        next(err)
    }
}