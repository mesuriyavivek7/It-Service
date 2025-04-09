import ISSUE from "../model/ISSUE.js";
import DEVICE from "../model/DEVICE.js";
import SERVICE from "../model/SERVICE.js";
import ADDRESS from "../model/ADDRESS.js";
import EMPLOYEE from "../model/EMPLOYEE.js";
import TIME from "../model/TIME.js";
import OTP from "../model/OTP.js";
import moment from 'moment'
import dotenv from 'dotenv'
import USER from "../model/USER.js";
import twilio from 'twilio'
import fs from 'fs'

const removeFolder = (folderPath) =>{
    try{
      if(fs.existSync(folderPath)){
         fs.rmSync(folderPath,{ recursive:true, force:true })
      }
    }catch(err){
        console.error(`Error while removing file: ${folderPath}`, err);
    }
}


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

        if(!mongoid || !userType){
            removeFolder(req.uniqueFolder)
            return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})
        } 

        if(userType!=='user'){
            removeFolder(req.uniqueFolder)
            return res.status(400).json({message:"Invalid user type.",status:400})
        } 

        const {issue_description, device, address, time, date, service} = req.body

        if(!issue_description || !device || !time || !date || !service){
            removeFolder(req.uniqueFolder)
            return res.status(400).json({message:"Please provide all required fields.",status:400})
        }
         

        //Check device exist or not
        const checkDevice = await DEVICE.findById(device)

        if(!checkDevice){
            removeFolder(req.uniqueFolder)
            return res.status(404).json({message:"Device is not found.",status:404})
        } 

        //Check Service exist or not
        const checkService = await SERVICE.findById(service)

        if(!checkService){
            removeFolder(req.uniqueFolder)
            return res.status(404).json({message:"Service is not found.",status:404})
        }

        //Check time exist or not
        const checkTime = await TIME.findById(time)

        if(!checkTime){
            removeFolder(req.uniqueFolder)
            return res.status(404).json({message:"Time is not found",status:404})
        }

        let images = []

        if(req.files.length !== 0){
             images = req.files.map((file)=>
              (
                {
                    fileName:file.fileName,
                    filePath:file.path,
                    fileType:file.mimetype,
                    fileSize:file.size
                }
              )
             )
        }
        
        const newIssue = new ISSUE({
            issue_description,
            device,
            address,
            time,
            date,
            added_by:mongoid,
            service,
            images
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
        .populate('assignedEmployee')

        if(!issue) return res.status(404).json({message:"issue not found.",status:404})

        return res.status(200).json({message:'issue retrived.',data:issue,status:200})

    }catch(err){
        next(err)
    }
}

//Get One Issue for admin
export const getOneIssueForAdmin = async (req, res, next) =>{
    try{
        const {issueId} = req.params

        if(!issueId) return res.status(400).json({message:"Please provide issue id.",status:400})

        const issue = await ISSUE.findById(issueId)
        .populate('address')
        .populate('device')
        .populate('time')
        .populate('service')
        .populate('added_by')
        .populate('assignedEmployee')

        if(!issue) return res.status(404).json({message:"Issue is not found.",status:404})

        return res.status(200).json({message:"Issue retrived successfully.",data:issue,status:200})

    }catch(err){
        next(err)
    }
}

//Get all issues 
export const getAllIssues = async (req, res, next) =>{
    try{
       const {status} = req.query
       
       if(!status){
        const allIssues = await ISSUE.find().sort({ createdAt: -1 })
        .populate('address')
        .populate('device')
        .populate('time')
        .populate('service')
        .populate('added_by')
        .populate('assignedEmployee')

        return res.status(200).json({message:"All issues retrived.",data:allIssues,status:200})
       }else{
         const filterIssues = await ISSUE.find({status:status}).sort({createdAt: -1})
        .populate('address')
        .populate('device')
        .populate('time')
        .populate('service')
        .populate('added_by')
        .populate('assignedEmployee')

         return res.status(200).json({message:`${status} issues retrived.`,data:filterIssues,status:200})
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

        if(issue.status==="Ongoing") return res.status(400).json({message:"Issue cant't be cancelled because employee is ongoing for service.",status:400})

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

//For start issue working by employee
export const startIssueWorking = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req

        if(!mongoid || !userType) return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})

        if(userType!=="employee") return res.status(401).json({message:"You are now allowed to start working on this issue.",status:401})

        const {issueId} = req.params

        if(!issueId) return res.status(400).json({message:"Please provide issue id for resolve this issue.",status:400})

        const issue = await ISSUE.findById(issueId)

        if(!issue) return res.status(404).json({message:"Issue is not found.",status:404})

        if(!issue.assignedEmployee) return res.status(400).json({message:"No Any employee assigned to this issue.",status:400})

        if(issue.assignedEmployee.toString() !==  mongoid.toString()) return res.status(400).json({message:"Requested issue is not assigned to you."})

        const updatedIssue = await ISSUE.findByIdAndUpdate(issueId,{$set:{status:"Ongoing"}},{new:true})

        return res.status(200).json({message:"Issue status sucessfully changed from pending to ongoing.",data:updatedIssue,status:200})

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

       await ISSUE.findByIdAndUpdate(issueId,{$set:{status:'Resolved'}})

    //  await ISSUE.findByIdAndUpdate(issueId,{$set:{assignedEmployee:null,status:'Resolved'}})

       return res.status(200).json({message:"Service resolved successfully.",status:200})

    }catch(err){
        next(err)
    }
}