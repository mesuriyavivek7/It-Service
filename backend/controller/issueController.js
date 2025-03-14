import ISSUE from "../model/ISSUE.js";
import DEVICE from "../model/DEVICE.js";
import SERVICE from "../model/SERVICE.js";
import ADDRESS from "../model/ADDRESS.js";
import EMPLOYEE from "../model/EMPLOYEE.js";
import OTP from "../model/OTP.js";
import moment from 'moment'
import dotenv from 'dotenv'
import USER from "../model/USER.js";
import twilio from 'twilio'

//Configure dotenv
dotenv.config()

const accountSiD=process.env.ACCOUNT_SID
const authToken=process.env.AUTH_TOKEN

const client = new twilio(accountSiD, authToken);

//For generate otp
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();


const checkCancellation = (date,time) =>{
    const issueDate = moment(date).format('YYYY-MM-DD')

    const issueTime = moment(time, "h:mmA").format("HH:mm"); 

    const issueDateTime = moment(`${issueDate} ${issueTime}`, "YYYY-MM-DD HH:mm");

    const currentTime = moment.utc();

    const timeDifference = issueDateTime.diff(currentTime, "minutes");

    if (timeDifference <= 60) {
       return false
    }else{
       return true
    }

}


//Create new issue
export const createIssue = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req

        if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

        if(userType!=='user') return res.status(400).json({message:"Invalid user type.",status:400})

        const {issue_description, device, address, time, date, service} = req.body

        if(!issue_description || !device || !address || !time || !date || !service) return res.status(400).json({message:"Please provide all required fields.",status:400})

        //Check device exist or not
        const checkDevice = await DEVICE.findById(device)

        if(!checkDevice) return res.status(404).json({message:"Device is not found.",status:404})

        //Check address exist or not
        const checkAddress = await ADDRESS.findById(address)

        if(!checkAddress) return res.status(404).json({message:"Address is not found.",status:404})

        //Check Service exist or not
        const checkService = await SERVICE.findById(service)

        if(!checkService) return res.status(404).json({message:"Service is not found.",status:404})

        const newIssue = new ISSUE({
            issue_description,
            device,
            address,
            time,
            date,
            added_by:mongoid,
            service
        })
        
        await newIssue.save()

        return res.status(200).json({message:"New service created successfully",data:newIssue,status:200})
    }catch(err){
        next(err)
    }
}


//Get One Issue
export const getOneIssue = async (req, res, next) =>{
    try{
        const {issueId} = req.params
        
        if(!issueId) return res.status(400).json({message:"Please provide issue id.",status:400})

        const { mongoid, userType } = req

        if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

        if(userType!=='user') return res.status(400).json({message:"Invalid user type.",status:400})

        const issue = await ISSUE.findOne({_id:issueId,added_by:mongoid})
        .populate('address')
        .populate('device')
        .populate('time')
        .populate('service')
        .populate('added_by')

        if(!issue) return res.status(404).json({message:"issue not found.",status:404})

        return res.status(200).json({message:'issue retrived.',data:issue,status:200})

    }catch(err){
        next(err)
    }
}

//Get all issues 
export const getAllIssues = async (req, res, next) =>{
    try{
       const {status} = req.query
       
       if(!status){
        const allIssues = await ISSUE.find()
        .populate('address')
        .populate('device')
        .populate('time')
        .populate('service')
        .populate('added_by')

        return res.status(200).json({message:"All issues retrived.",data:allIssues,status:200})
       }else{
         const filterIssues = await ISSUE.find({status:status})
        .populate('address')
        .populate('device')
        .populate('time')
        .populate('service')
        .populate('added_by')

         return res.status(200).json({message:`${status} issues retrived.`,data:filterIssues})
       }
      
    }catch(err){
        next(err)
    }
}

//Cancel issue 
export const cancelIssue = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req

        if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

        const {issueId} = req.params

        if(!issueId) return res.status(400).json({message:"Please provide issue id.",status:400})

        const issue = await ISSUE.findById(issueId).populate('time')

        if(!issue) return res.status(404).json({message:"Issue is not found.",status:404})

        if(!checkCancellation(issue.date,issue.time?.time)) return res.status(404).json({message:"Cancellation not allowed within 1 hour of scheduled time."})
        
        if(issue.assignedEmployee){
            let employeeId = issue.assignedEmployee
            await ISSUE.findByIdAndUpdate(issueId,{$set:{assignedEmployee:null}})

            await EMPLOYEE.findByIdAndUpdate(employeeId,{$pull:{assignedIssues:issueId}})
        }

        await ISSUE.findByIdAndUpdate(issueId,{$set:{status:'Canceled'}})
        
        return res.status(200).json({message:"Your requested service canceled.",status:200})

    }catch(err){
        next(err)
    }
}

//Send Otp for Resolve Issue 
export const resolveIssue = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req

        if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

        if(userType==="user") return res.status(200).json({message:"You are not allowed to resolve this service.",status:401})

        const { issueId } = req.params

        const issue = await ISSUE.findOne({_id:issueId,assignedEmployee:mongoid})

        if(!issue) return res.status(404).json({message:"Issue is not found.",status:404})

        if(!issue.assignedEmployee) return res.status(404).json({message:"Employee not found for your service.",status:404})

        const employee = await EMPLOYEE.findById(issue.assignedEmployee)
 
        if(!employee) return res.status(404).json({message:"Employee not found for your service.",status:404})

        const userId = issue.added_by

        if(!userId) return res.status(404).json({message:"User for this service not found.",status:404})

        const user = await USER.findById(userId)

        if(!user) return res.status(404).json({message:"User not found.",status:404})

        const otp = generateOTP()

        // const message = await client.messages.create({
        //     body: `Your verification code is: ${otp}`,
        //     from: process.env.TWILIO_PHONE_NUMBER,
        //     to: user.mobileno
        // });

        let newOtp = new OTP({
            mobileno:user.mobileno,
            otp
        })

        await newOtp.save()

        return res.status(200).json({message:"Otp sended successfully to user.",data:{otp},status:200})
        
    }catch(err){
        next(err)
    }
}


//Verify Otp for resolve issue
export const verifyResolveIssue = async (req, res, next) =>{
    try{
       const {mongoid, userType} = req

       if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

       if(userType!=='user') return res.status(401).json({message:"You are not allow to complete this service.",status:401})

       const { otp } = req.body

       const {issueId} = req.params
      
       if(!issueId) return res.status(400).json({message:"Please provide issue id.",status:400})

       const issue = await ISSUE.findById(issueId).populate('added_by')

       if(!issue) return res.status(404).json({message:"Issue is not found.",status:404})

       if(!issue.assignedEmployee) return res.status(404).json({message:"Employee not found for your service.",status:404})

       const employee = await EMPLOYEE.findById(issue.assignedEmployee)

       if(!employee) return res.status(404).json({message:"Employee not found for your service.",status:404})

       if(!otp) return res.status(400).json({message:"Please provide otp.",status:400})

       const dbotp = await OTP.findOne({mobileno:issue.added_by?.mobileno})

       if(!dbotp) return res.status(400).json({message:"OTP has expired. Please request a new one.",data:false,status:400})

       if(dbotp.otp!==otp) return res.status(400).json({message:"Invalid OTP. Please try again.",data:false,status:400})

       await OTP.findOneAndDelete({mobileno:issue.added_by?.mobileno})

       await EMPLOYEE.findByIdAndUpdate(issue.assignedEmployee,{$pull:{assignedIssues:issueId}})

       await ISSUE.findByIdAndUpdate(issueId,{$set:{assignedEmployee:null,status:'Resolved'}})

       return res.status(200).json({message:"Service resolved successfully.",status:200})

    }catch(err){
        next(err)
    }
}