import EMPDEPARTMENT from "../model/EMPDEPARTMENT.js";
import EMPDESIGNATION from "../model/EMPDESIGNATION.js";



export const createDesignation = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        if(!mongoid || !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const {designations} = req.body 

        if(!Array.isArray(designations) || designations.length===0) return res.status(400).json({message:"Please provide designation list.",status:400})
        
        const designationDocs = designations.map((name)=>({designation_name:name}))
    
        const savedDesignations = await EMPDESIGNATION.insertMany(designationDocs)

        return res.status(201).json({message:"Designation saved successfully.",data:savedDesignations})
        
    }catch(err){
        next(err)
    }
}

export const getAllDesignation = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        if(!mongoid || !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const designations = await EMPDESIGNATION.find()
        
        return res.status(200).json({message:"All Designation retrived.",status:200,data:designations})
    }catch(err){
        next(err)
    }
} 


export const createDepartment = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        if(!mongoid || !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const {departments} = req.body

        if(!Array.isArray(departments) || departments.length===0) return res.status(400).json({message:"Please provide department list.",status:400})

        const departmentDocs = departments.map((name) => ({department_name:name}))

        const savedDepartment = await EMPDEPARTMENT.insertMany(departmentDocs)

        return res.status(201).json({message:"Department saved successfully.",data:savedDepartment})

    }catch(err){
        next(err)
    }
}

export const getAllDepartments = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        if(!mongoid || !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const departments = await EMPDEPARTMENT.find()

        return res.status(200).json({message:"All departments retrived.",status:200,data:departments})

    }catch(err){
        next(err)
    }
}