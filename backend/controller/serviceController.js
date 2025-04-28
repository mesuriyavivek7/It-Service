import ISSUE from "../model/ISSUE.js";
import SERVICE from "../model/SERVICE.js";
import fs from 'fs'
import NOTIFY from "../model/NOTIFY.js";
import USER from "../model/USER.js";
import EMPLOYEE from "../model/EMPLOYEE.js";
import mongoose from "mongoose";

//For create new service 
export const createService = async (req, res, next)=>{
    try{
        if(!req.file) {
            return res.status(415).json({ message: "No file uploaded", status: 415 });
        } 

        const {mongoid} = req
        if(!mongoid) return res.status(401).json({message:"Unauthorized request: Missing user ID.",status:401})

        const {service_name, price} = req.body

        if(!service_name || !price) return res.status(400).json({message:"Please provide all required fields.",status:400})

        const priceValue = Number(price)

        const newService = new SERVICE({
            service_name,
            service_image:{
              fileName:req.file.filename,
              filePath:req.file.path,
              fileSize:req.file.size,
              fileType:req.file.mimetype
            },
            price:priceValue,
            added_by:mongoid
        })
 
        await newService.save()

        return res.status(200).json({message:"New service created successfully.",data:newService,status:200})

    }catch(err){
        next(err)
    }
}


//Get all services 
export const getAllServices = async (req, res, next) =>{
    try{
       const {status} = req.query
       let allServices = []
       
       if(!status){
        allServices = await SERVICE.find()
       }else{
        allServices = await SERVICE.find({status})
       }
       
       return res.status(200).json({message:"All services retrived.",data:allServices,status:200})
    }catch(err){
        next(err)
    }
}

//For update service
export const updateService = async (req, res, next) =>{
    try{
        const { serviceid } = req.params;

        if (!serviceid) {
            return res.status(400).json({ message: "Please provide service ID.", status: 400 });
        }

        // Find the existing service before updating
        const existingService = await SERVICE.findById(serviceid);
        if (!existingService) {
            return res.status(404).json({ message: "Service not found by ID.", status: 404 });
        }

        let updateData = { ...req.body };

        // Handle file upload
        if (req.file) {
            // Check if an existing file exists and delete it
            if (existingService.service_image && existingService.service_image.filePath) {
                const oldFilePath = existingService.service_image.filePath;
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath); // Delete the existing file
                }
            }

            // Update with new file details
            updateData.service_image = {
                fileName: req.file.filename,
                filePath: req.file.path,
                fileSize: req.file.size,
                fileType: req.file.mimetype,
            };
        }

        // Update the service in the database
        const updatedService = await SERVICE.findByIdAndUpdate(serviceid, updateData, { new: true });

        return res.status(200).json({ message: "Service updated.", data: updatedService, status: 200 });

    }catch(err){
        next(err)
    }
}

export const enableService = async (req, res, next) =>{
    try{

      const {mongoid, userType} = req
      if(!mongoid) return res.status(401).json({message:"Unauthorized request: Missing user ID.",status:401})

      if(userType!=='admin') return res.status(401).json({message:"You can't perform this operation.",status:401})

      const {serviceId} = req.params

      if(!serviceId) return res.status(400).json({message:"Please provide service id.",status:400})

      const updatedService = await SERVICE.findByIdAndUpdate(serviceId,{$set:{status:true}},{new:true})

      if(!updatedService) return res.status(404).json({message:"Service not found.",status:404})

      return res.status(200).json({message:"Service enable successfully.",status:200})

    }catch(err){
      next(err)
    }
}

export const disableService = async (req, res, next) =>{
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const {mongoid, userType} = req
        if(!mongoid){
            await session.abortTransaction()
            session.endSession()
            return res.status(401).json({message:"Unauthorized request: Missing user ID.",status:401})
        } 

        if(userType !== 'admin'){
            await session.abortTransaction()
            session.endSession()
            return res.status(403).json({ message: "Forbidden: Only admins can perform this operation.", status: 403 });
        }

        const {serviceId} = req.params

        if(!serviceId){
            await session.abortTransaction()
            session.endSession()
            return res.status(400).json({ message: "Bad Request: Service ID is required.", status: 400 });
        }

        
        const issues = await ISSUE.find({ service: serviceId,status:"Pending"}).session(session);

        for(const issue of issues){
            const existUser = await USER.findById(issue.added_by).session(session)

            if(existUser) {
                await ISSUE.findByIdAndUpdate(issue._id,{$set:{status:"Canceled"}},{session})

                //Notify User
                const userNotification = new NOTIFY({
                   from:mongoid,
                   fromType: 'admin',
                   to: existUser._id,
                   toType: 'user',
                   message: 'Your issue has been canceled because the associated service has been disabled.',
                   type: 'issue_cancel'
                })

                await userNotification.save({session})

                if(issue.assignedEmployee){
                    //Remove issue from employee
                    await EMPLOYEE.findByIdAndUpdate(
                        issue.assignedEmployee,
                        {$pull:{assignedIssues:issue._id}},
                        {session}
                    )

                    //Remove employee from issue
                    await ISSUE.findByIdAndUpdate(
                        issue._id,
                        {$set: {assignedEmployee: null}},
                        {session}
                    )

                    //Notify employee
                    const employeeNotification = new NOTIFY({
                        from:mongoid,
                        fromType:'admin',
                        to:issue.assignedEmployee,
                        toType:"employee",
                        message: "An issue assigned to you has been canceled due to service disablement.",
                        type: 'issue_cancel'
                    });

                    await employeeNotification.save({session})
                }

            }
        }

        //Disable the service
        const updatedService = await SERVICE.findByIdAndUpdate(
            serviceId,
            {$set: {status:false}},
            {new:true}
        )

        if (!updatedService) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Service not found.", status: 404 });
        }

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Service disabled successfully.", status: 200 });
      
       
    }catch(err){
        await session.abortTransaction();
        session.endSession();
        next(err)
    }
}