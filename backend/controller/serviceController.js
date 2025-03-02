import SERVICE from "../model/SERVICE.js";
import fs from 'fs'

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
       const allServices = await SERVICE.find()

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

