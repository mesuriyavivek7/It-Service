import ADMIN from "../model/ADMIN.js";
import bcryptjs from 'bcryptjs'
import LOGINMAPPING from "../model/LOGINMAPPING.js";

//For create new admin
export const createAdmin = async (req, res, next) =>{
    try{
        const {name, email, mobileno, password} = req.body
        if(!name || !email || !mobileno || !password){
            return res.status(400).json({message:"Please provide all required fields.",status:400})
        }

        const existUser = await LOGINMAPPING.findOne({email,mobileno})

        if(existUser) return res.status(409).json({message:"User is already exist with same mobileno or email address.",status:409})

        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(password, saltRounds);
        
        const newAdmin = new ADMIN({
            name,
            email,
            mobileno,
        })

        await newAdmin.save();

        const newLoginMap = new LOGINMAPPING({
            mongoid:newAdmin._id,
            mobileno,
            email,
            password:hashedPassword,
            userType:'admin'
        })

        await newLoginMap.save()

        return res.status(200).json({message:"New Admin created successfully",status:200,data:newAdmin})

    }catch(err){
        next(err)
    }
}

//For get one admin
export const getOneAdmin = async (req, res, next) =>{
    try{
       const {mongoid} = req

       if(!mongoid) return res.status(400).json({message:"Unauthorized request: Missing user ID.",status:400})

       const admin = await ADMIN.findById(mongoid)

       if(!admin) return res.status(404).json({message:"Admin not found.",status:404})

       return res.status(200).json({message:"Admin retrived.",data:admin,status:200})

    }catch(err){
        next(err)
    }
}


//For update admin
export const updateAdmin = async (req, res, next) =>{
    try{
       const { mongoid } = req

       if(!mongoid) return res.status(400).json({message:"Unauthorized request: Missing user ID.",status:400})

       if(Object.keys(req.body).includes("email")){
          const existAdmin = await LOGINMAPPING.findOne({email:req.body.email})
          
          if(existAdmin) return res.status(409).json({message:"Admin is already exist with same email address.",status:409})
       }

       if(Object.keys(req.body).includes("mobileno")){
          const existAdmin = await LOGINMAPPING.findOne({mobileno:req.body.mobileno})

          if(existAdmin) return res.status(409).json({message:"Admin is alresy exist with same mobile number.",status:409})
       }

       const updatedAdmin = await ADMIN.findByIdAndUpdate(mongoid,{$set:{...req.body}},{new:true,runValidators:true})

       if(!updatedAdmin) return res.status(404).json({message:"Admin not found.",status:404})

       return res.status(200).json({message:"Admin updated sucessfully",data:updatedAdmin,status:200})

    }catch(err){
        next(err)
    }
}


//For delete admin
export const removeAdmin = async (req, res, next) =>{
    try{
       const { mongoid } = req

       if(!mongoid) return res.status(400).json({message:"Unauthorized request: Missing user ID.",status:400})

       const deletedAdmin = await ADMIN.findByIdAndDelete(mongoid)

       if(!deletedAdmin) return res.status(404).json({message:"Admin not found.",status:404})

       return res.status(200).json({message:"Admin deleted successfully.",data:deletedAdmin,status:200})
    }catch(err){
        next(err)
    }
}