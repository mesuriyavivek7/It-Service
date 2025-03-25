import USER from "../model/USER.js";
import LOGINMAPPING from "../model/LOGINMAPPING.js";
import ISSUE from "../model/ISSUE.js";
import fs from 'fs'

const removeFile = (filePath) => {
    try {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error(`Error while removing file: ${filePath}`, error);
    }
};

//For create new user
export const createUser = async (req, res, next)=>{
    try{
        const {name, mobileno} = req.body
        if(!name || !mobileno) return res.status(400).json({status:400,message:"Please provide all required fields."})

        const existUser = await LOGINMAPPING.findOne({mobileno})

        if(existUser) return res.status(409).json({status:409,message:"User is already exist."})

        const newUser = new USER({...req.body})

        await newUser.save()

        const newLoginMap = new LOGINMAPPING({
            mobileno,
            userType:'user',
            mongoid:newUser._id
        })

        await newLoginMap.save()

        return res.status(200).json({message:"New user created successfully.",data:newUser,status:200})
    }catch(err){
        next(err)
    }
}

//For update user by id
export const updateUser = async (req, res, next)=>{
    try{
       const {mongoid} = req 

       if(!mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID", status: 400 });
       }

       const {userId} = req.params

       const user = await USER.findById(userId)

       if(!user) return res.status(404).json({status:404,message:"User not found."})

       const {name, mobileno} = req.body 

       if(mobileno!==user.mobileno){

        const existUser = await LOGINMAPPING.findOne({mobileno})

        if(existUser) return res.status(409).json({message:"User is already exist with same mobileno.",status:409})

        await LOGINMAPPING.findOneAndUpdate({mongoid:userId},{$set:{mobileno}})

       }

       const updatedUser = await USER.findByIdAndUpdate(userId,{$set:{name,mobileno}},{new:true})

       
       return res.status(200).json({status:200,data:updatedUser,message:"User details updated successfully."})

    }catch(err){
        next(err)
    }
}

//For get user by id
export const getUser = async (req, res, next) =>{
    try{
        if(!req.mongoid){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID", status: 400 });
        }

        const user = await USER.findById(req.mongoid)

        if(!user) return res.status(404).json({message:"User not found",status:404})

        return res.status(200).json({message:"User retrived.",data:user,status:200})
    }catch(err){
        next(err)
    }
}

//For get all user
export const getAllUser = async (req, res, next) =>{
    try{
         // Fetch all users
         const users = await USER.find();

         // Get issue statistics grouped by added_by (user)
         const issueStats = await ISSUE.aggregate([
             {
                 $group: {
                     _id: "$added_by", // Group by user ID
                     total_issues: { $sum: 1 },
                     resolved_issues: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
                     pending_issues: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
                     canceled_issues: { $sum: { $cond: [{ $eq: ["$status", "Canceled"] }, 1, 0] } }
                 }
             }
         ]);
 
         // Convert issueStats array to an object for quick lookup
         const issueMap = issueStats.reduce((acc, stat) => {
             acc[stat._id.toString()] = stat;
             return acc;
         }, {});
 
         // Attach issue stats to each user
         const usersWithIssueStats = users.map(user => ({
             ...user.toObject(),
             issueStats: issueMap[user._id.toString()] || {
                 total_issues: 0,
                 resolved_issues: 0,
                 pending_issues: 0,
                 canceled_issues: 0
             }
         }));
 
         return res.status(200).json({
             message: "All users retrieved.",
             data: usersWithIssueStats,
             status: 200
         });

    }catch(err){
        next(err)
    }
}

//For delete user by id
export const deleteUser = async (req, res, next) =>{
    try{
       const {userid} = req.params

       const deletedUser = await USER.findByIdAndDelete(userid)
       
       if(!deletedUser) return res.status(404).json({message:"User not found.",status:404})

       return res.status(200).json({message:"user deleted"})
    }catch(err){ 
        next(err)
    }
}


export const updateUserFromApplication = async (req, res, next) => {
    try {
        const { mongoid } = req;

        if (!mongoid) {
            removeFile(req.file?.path); // Remove uploaded file if exists
            return res.status(400).json({ message: "Unauthorized request: Missing user ID", status: 400 });
        }

        let updatedData = { ...req.body };
        const user = await USER.findById(mongoid);
        if (!user) {
            removeFile(req.file?.path); // Remove uploaded file if exists
            return res.status(404).json({ message: "User not found.", status: 404 });
        }

        // Handling mobile number update
        if (updatedData.mobileno && user.mobileno !== updatedData.mobileno) {
            const existMobileUser = await LOGINMAPPING.findOne({ mobileno: updatedData.mobileno });
            if (existMobileUser) {
                removeFile(req.file?.path); // Remove uploaded file if exists
                return res.status(409).json({ message: "User already exists with the same mobile number.", status: 409 });
            }

            await LOGINMAPPING.findByIdAndUpdate(mongoid, { $set: { mobileno: updatedData.mobileno } });
        }

        // Handling profile picture update
        if (req.file) {
            try {
                // Delete the old profile picture if it exists
                if (user?.profilePic?.filePath && fs.existsSync(user.profilePic.filePath)) {
                    fs.unlinkSync(user.profilePic.filePath);
                }

                updatedData.profilePic = {
                    fileName: req.file.filename, // Corrected property name
                    fileSize: req.file.size,
                    filePath: req.file.path,
                    fileType: req.file.mimetype
                };
            } catch (error) {
                removeFile(req.file?.path); // Remove new file if error occurs
                return res.status(500).json({ message: "Error while deleting old file.", status: 500 });
            }
        }

 

        // Update user details
        const updatedUser = await USER.findByIdAndUpdate(mongoid, { $set: updatedData }, { new: true });

        return res.status(200).json({ message: "User details updated successfully.", data: updatedUser, status: 200 });
    } catch (err) {
        removeFile(req.file?.path); // Remove uploaded file if an error occurs
        next(err);
    }
};