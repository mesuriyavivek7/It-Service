import ISSUE from "../model/ISSUE.js";
import DEVICE from "../model/DEVICE.js";
import SERVICE from "../model/SERVICE.js";
import ADDRESS from "../model/ADDRESS.js";


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

        if(!issue) return res.status(404).json({message:"issue not found.",status:404})

        return res.status(200).json({message:'issue retrived.',data:issue,status:200})

    }catch(err){
        next(err)
    }
}