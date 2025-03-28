import OTP from "../model/OTP.js";
import dotenv from 'dotenv'
import twilio from 'twilio'
import jwt from 'jsonwebtoken'
import LOGINMAPPING from "../model/LOGINMAPPING.js";
import USER from "../model/USER.js";
import EMPLOYEE from "../model/EMPLOYEE.js";


//Configure dotenv
dotenv.config()

const accountSiD=process.env.ACCOUNT_SID
const authToken=process.env.AUTH_TOKEN

const client = new twilio(accountSiD, authToken);

//For generate otp
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();


//For send otp for login
export const sendOtp = async (req, res, next) =>{
    try{
        const {mobileno} = req.body

        if(!mobileno) return res.status(400).json({message:"Please provide mobile number",status:400})

        const existuser = await LOGINMAPPING.findOne({mobileno})
        
        if(!existuser) return res.status(404).json({message:"User not found.",status:404})

        const otp = generateOTP()

        const message = await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobileno
        });

        let newOtp = new OTP({
            mobileno,
            otp
        })

        await newOtp.save()

        let response = {
            otp,
            // sid:message.sid
            mobileno,

        }

        return res.status(200).json({message:"Otp sended successfully",data:response,status:200})

    }catch(err){
        next(err)
    }
}


//For verify otp for login
export const verifyOtp = async (req, res, next) =>{
    const {mobileno , otp} = req.body

    if(!mobileno || !otp) return res.status(400).json({message:"Please provide otp and mobileno",status:400})

    try{
       const user = await LOGINMAPPING.findOne({mobileno})

       let existUser = null
       if(user.userType==='user'){
          existUser = await USER.findOne({mobileno})
       }else if(user.userType==='employee'){
          existUser = await EMPLOYEE.findOne({mobileno})         
       }
       
       if(!user) return res.status(404).json({message:"User not found.",status:404})
       
       const dbotp = await OTP.findOne({mobileno})

       if(!dbotp) return res.status(400).json({message:"OTP has expired. Please request a new one.",data:false,status:400})

       if(dbotp.otp!==otp) return res.status(400).json({message:"Invalid OTP. Please try again.",data:false,status:400})

       await OTP.findOneAndDelete({mobileno})

       const token = jwt.sign({mongoid:user.mongoid,userType:user.userType}, process.env.JWT,{
        expiresIn: "365d", // Lifetime token (1 year)
       })

       return res.status(200).json({message:"Otp verified and Login successfully.",data:{token,userId:user.mongoid,mobileno,name:existUser.name,userType:user.userType},status:200})

    }catch(err){
        next(err)
    }
}


//Send otp for sign up user
export const sendOtpForCreateUser = async (req, res, next)=>{
    try{
        const {name, mobileno} = req.body
        if(!name || !mobileno) return res.status(400).json({message:"Please provide all required fields.",status:400})

        const existUser = await LOGINMAPPING.findOne({mobileno})

        if(existUser) return res.status(409).json({message:"User is already exist with same mobileno.",status:409})

        const otp = generateOTP()

        const message = await client.messages.create({
            body: `Your verification code is: ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobileno
        });


        let newOtp = new OTP({
            name,
            mobileno,
            otp
        })

        await newOtp.save()

        return res.status(200).json({message:"Otp Sended for register new user successfully",data:{otp,mobileno,name},status:200})

    }catch(err){
        next(err)
    }
}

//Verify otp for sign up user
export const verifyOtpForCreateUser = async (req, res, next)=>{
    try{
        const {mobileno,otp} = req.body

        if(!mobileno || !otp) return res.status(400).json({message:"Please provide all required fields.",status:400})

        const dbotp = await OTP.findOne({mobileno})

        if(!dbotp) return res.status(400).json({message:"OTP has expired. Please request a new one.",data:false,status:400})

        if(dbotp.otp!==otp) return res.status(400).json({message:"Invalid OTP. Please try again.",data:false,status:400})

        await OTP.findOneAndDelete({mobileno})

        let name = dbotp.name
        
        const newUser = new USER({
            name,
            mobileno
        })

        await newUser.save()

        const newLoginMap = new LOGINMAPPING({
            mobileno,
            userType:'user',
            mongoid:newUser._id
        })

        await newLoginMap.save()

        const token = jwt.sign({mongoid:newUser._id,userType:'user'}, process.env.JWT,{
            expiresIn: "365d", // Lifetime token (1 year)
        })

        return res.status(200).json({message:"New user created successfully",data:{token,name,mobileno,userId:newUser._id,userType:'user'},status:200})

    }catch(err){
        next(err)
    }
}
