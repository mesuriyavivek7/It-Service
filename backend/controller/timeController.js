import TIME from "../model/TIME.js";


export const createTime = async (req, res, next)=>{
    try{
       const {mongoid, userType} = req

       if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

       const {time} = req.body

       if(!time) return res.status(400).json({message:"Please provide time.",status:400})

       const newTime = new TIME({
        time,
        added_by:mongoid
       })

       await newTime.save()

       return res.status(200).json({message:"New Time created.",data:newTime,status:200})
    }catch(err){
        next(err)
    }
}

export const updateTime = async (req, res, next) =>{
    try{
      const {mongoid, userType} = req

      if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})
      const {timeId} = req.params
      const {time} = req.body

      const updatedTime = await TIME.findByIdAndUpdate(timeId,{$set:{time}})

      if(!updatedTime) return res.status(404).json({message:"Time is not found.",status:404})

      return res.status(200).json({message:"Time is updated.",status:200,data:updatedTime})
 
    }catch(err){
        next(err)
    }
}

export const getAllTimes = async (req, res, next) =>{
    try{
        const times = await TIME.find().populate('added_by')

        return res.status(200).json({message:"All time retrived.",status:200,data:times})
    }catch(err){
        next(err)
    }
}

