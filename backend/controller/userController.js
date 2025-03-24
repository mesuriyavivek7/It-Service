import USER from "../model/USER.js";
import LOGINMAPPING from "../model/LOGINMAPPING.js";
import ISSUE from "../model/ISSUE.js";

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

