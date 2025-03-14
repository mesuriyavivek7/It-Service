import USER from "../model/USER.js";
import LOGINMAPPING from "../model/LOGINMAPPING.js";


//For create new user
export const createUser = async (req, res, next)=>{
    try{
        const {name, mobileno} = req.body
        if(!name || !mobileno) return res.status(400).json({status:400,message:"Please provide all required fields."})

        const existUser = await LOGINMAPPING.findOne({mobileno})

        if(existUser) return res.status(409).json({status:409,message:"User is already exist."})

        const newUser = new USER({...req.body})

        await newUser.save()

        const newLoginMap = new LOGINMAPPING({
            mobileno,
            userType:'user',
            mongoid:newUser._id
        })

        await newLoginMap.save()

        return res.status(200).json({message:"New user created successfully.",data:newUser,status:200})
    }catch(err){
        next(err)
    }
}

//For update user by id
export const updateUser = async (req, res, next)=>{
    try{
       if(!req.mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID", status: 400 });
       }

       const {mobileno} = req.body

       if(mobileno){
          const existUser = await LOGINMAPPING.findOne({mobileno})

          if(existUser) return res.status(409).json({message:"User is alredy exist with same mobile no.",status:400})
       }

       const updateUser = await USER.findByIdAndUpdate(req.mongoid,{$set:{...req.body}},{new:true})

       if(!updateUser) return res.status(404).json({message:"User not found",status:404})

       if(mobileno){
        await LOGINMAPPING.findOneAndUpdate({mongoid},{$set:{mobileno}})
       }

       return res.status(200).json({status:200,data:updateUser,message:"User details updated successfully."})
    }catch(err){
        next(err)
    }
}

//For get user by id
export const getUser = async (req, res, next) =>{
    try{
        if(!req.mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID", status: 400 });
        }

        const user = await USER.findById(req.mongoid)

        if(!user) return res.status(404).json({message:"User not found",status:404})

        return res.status(200).json({message:"User retrived.",data:user,status:200})
    }catch(err){
        next(err)
    }
}

//For get all user
export const getAllUser = async (req, res, next) =>{
    try{
        const users = await USER.find()

        return res.status(200).json({message:"All users retrived.",data:users,status:200})
    }catch(err){
        next(err)
    }
}

//For delete user by id
export const deleteUser = async (req, res, next) =>{
    try{
       const {userid} = req.params

       const deletedUser = await USER.findByIdAndDelete(userid)
       
       if(!deletedUser) return res.status(404).json({message:"User not found.",status:404})

       return res.status(200).json({message:"user deleted"})
    }catch(err){ 
        next(err)
    }
}