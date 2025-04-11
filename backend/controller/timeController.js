import TIME from "../model/TIME.js";
import ISSUE from "../model/ISSUE.js";
import mongoose from "mongoose";

export const createTime = async (req, res, next)=>{
    try{
       const {mongoid, userType} = req

       if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

       const {time} = req.body

       if(!time) return res.status(400).json({message:"Please provide time.",status:400})

       const existTime = await TIME.findOne({time})

       if(existTime) return res.status(409).json({message:"Time is already exist with same sloat.",status:409})

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

      const existTime = await TIME.findOne({time})
        
      if(existTime) return res.status(409).json({message:"Time is already exist with same sloat.",status:409})

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

export const deleteTime = async (req, res, next) =>{
    try{
      const session = await mongoose.startSession()
      session.startTransaction()

      const {mongoid, userType} = req

      if(!mongoid || !userType){
         await session.abortTransaction()
         session.endSession()
         return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})
      }

      const {timeId} = req.params

      if(!timeId){
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({message:"Please provide time id which you want to delete.",status:400})
      }

      const time = await TIME.findById(timeId).session(session)

      if(!time){
        await session.abortTransaction()
        session.endSession()
         return res.status(404).json({message:"Time is not found.",status:404}) 
      }

      const existIssue = await ISSUE.findOne({time:timeId}).session(session)

      if(existIssue){
        await ISSUE.findOneAndUpdate({time:timeId},{$set:{time:null,time_snapshots:time.time}})
      }

      await TIME.findByIdAndDelete(timeId,{session})

      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({message:"Time deleted successfully",status:200})

    }catch(err){
        next(err)
    }
}