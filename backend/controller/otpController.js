import OTP from "../model/OTP.js";
import dotenv from 'dotenv'
import twilio from 'twilio'
import jwt from 'jsonwebtoken'
import LOGINMAPPING from "../model/LOGINMAPPING.js";


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

        const existuser =  LOGINMAPPING.findOne({mobileno})
        
        if(!existuser) return res.status(404).json({message:"User not found.",status:404})

        const otp = generateOTP()

        // const message = await client.messages.create({
        //     body: `Your verification code is: ${otp}`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: mobileno
        // });

        let newOtp = new OTP({
            mobileno,
            otp
        })

        await newOtp.save()

        let response = {
            otp,
            // sid:message.sid
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
       
       if(!user) return res.status(404).json({message:"User not found.",status:404})
       
       const dbotp = await OTP.findOne({mobileno})

       if(!dbotp) return res.status(400).json({message:"OTP has expired. Please request a new one.",data:false,status:400})

       if(dbotp.otp!==otp) return res.status(400).json({message:"Invalid OTP. Please try again.",data:false,status:400})

       await OTP.findOneAndDelete({mobileno})

       const token = jwt.sign({mongoid:user.mongoid}, process.env.JWT,{
        expiresIn: "365d", // Lifetime token (1 year)
       })

       return res.status(200).json({message:"Otp verified and Login successfully.",data:{token,userId:user.mongoid},status:200})

    }catch(err){
        next(err)
    }
}