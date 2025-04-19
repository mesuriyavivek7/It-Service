import LOGINMAPPING from "../model/LOGINMAPPING.js"
import bcryptjs from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

//Configure dotenv
dotenv.config()

export const loginPortal = async (req, res, next)=>{
    try{
       const {email, password} = req.body
       if(!email || !password) return res.status(400).json({message:"Please provide all required.",status:400}) 
       
       const user = await LOGINMAPPING.findOne({email})

       if(!user) return res.status(404).json({message:"User not found by given email address.",status:404})

       const isPasswordMatched = await bcryptjs.compare(password, user.password)

       if(!isPasswordMatched) return res.status(401).json({message:"Password is incorrect.",status:401})

       const token = jwt.sign({mongoid:user.mongoid,userType:user.userType}, process.env.JWT,{
        expiresIn: "365d", // Lifetime token (1 year)
       })

        // Send the JWT token as a cookie
       res.cookie('it_token', token, {
         expires: new Date(Date.now() + 2592000000),
         httpOnly: true,
         domain:
          process.env.NODE_ENV === "production" ? ".stylic.ai" : undefined,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
       });

       return res.status(200).json({message:"Otp verified and Login successfully.",data:{token,userId:user.mongoid,userType:user.userType},status:200})

    }catch(err){
       next(err)
    }
}


export const validateUser = async (req, res, next) =>{
   try{
    const token = req.cookies.it_token;

    if (!token) return res.status(401).json({ message: "No token found." });

    const decoded = jwt.verify(token, process.env.JWT);

    const user = await LOGINMAPPING.findOne({ mongoid: decoded.mongoid });

    if (!user) return res.status(401).json({ message: "User not found.", status:401});

    return res.status(200).json({message:"User validation successfully.",data:{token,userId:user.mongoid,userType:user.userType},status:200})

   }catch(err){
      next(err)
   }
}


export const logoutPortal = async (req, res, next) => {
   try {
     res.clearCookie("it_token", {
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
       domain: process.env.NODE_ENV === "production" ? ".stylic.ai" : undefined,
     });
 
     return res.status(200).json({ message: "Logout successful", status: 200 });
   } catch (err) {
     next(err);
   }
 };
 