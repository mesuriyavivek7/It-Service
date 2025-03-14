import LEAVE from "../model/LEAVE.js";
import EMPLOYEE from "../model/EMPLOYEE.js";
import ISSUE from "../model/ISSUE.js";

//For create leave
export const createLeave = async (req, res, next) =>{
    try{
        const {mongoid, userType} = req
        if(!mongoid || !userType){
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        if(userType !== 'employee') return res.status(400).json({message:"Only employee can add leave.",status:400})

        const employee = await EMPLOYEE.findById(mongoid)

        if(!employee) return res.status(404).json({message:"Employee is not found.",status:404})

        const {leave_type,from,to,comments} = req.body

        if(!leave_type || !from || !to || !comments) return res.status(400).json({message:"Please provide all required fields.",status:400})

        const newLeave = new LEAVE({
            leave_type,
            from,
            to,
            comments,
            added_by:mongoid,
            handover_by:employee.added_by
        })

       await newLeave.save()

       return res.status(200).json({message:"Leave created successfully.",data:newLeave,status:200})

    }catch(err){
        next(err)
    }
}

//For get particuler employee leave
export const getEmpLeave = async (req, res, next)=>{
    try{
      const {mongoid, userType} = req
      if(!mongoid || !userType){
        return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
      }

      const leaves = await LEAVE.find({added_by:mongoid})

      return res.status(200).json({message:"All employee leave retrived.",data:leaves,status:200})

    }catch(err){
        next(err)
    }
} 

//For get all leave
export const getAllLeaves = async (req, res, next)=>{
    try{
      const {mongoid, userType} = req
      if(!mongoid || !userType){
        return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
      }
      
      const allLeaves = await LEAVE.find()

      return res.status(200).json({message:"All leaves retrived.",data:allLeaves,status:200})
    }catch(err){
        next(err)
    }
}


//Approve leave for employee
export const approveLeave = async (req, res, next) => {
    try {
        const { mongoid, userType } = req;
        if (!mongoid || !userType) {
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const { leaveId } = req.params;
        if (!leaveId) return res.status(400).json({ message: "Please provide leave id.", status: 400 });

        const leave = await LEAVE.findOne({ _id: leaveId, handover_by: mongoid });
        if (!leave) return res.status(404).json({ message: "Leave not found.", status: 404 });

        const employee = await EMPLOYEE.findById(leave.added_by).populate('assignedIssues');
        if (!employee) return res.status(404).json({ message: "Employee not found.", status: 404 });

        const issues = employee.assignedIssues;

        const leaveStartDate = new Date(leave.from);
        const leaveEndDate = new Date(leave.to);

        await Promise.all(issues.map(async (issue) => {
            const issueDate = new Date(issue.date);
        
            if (issueDate >= leaveStartDate && issueDate <= leaveEndDate) {
                // Remove issue from assignedIssues array
                await EMPLOYEE.findByIdAndUpdate(employee._id, {
                    $pull: { assignedIssues: issue._id }
                });

                // Update issue to remove assignedEmployee
                await ISSUE.findByIdAndUpdate(issue._id, {
                    $set: { assignedEmployee: null }
                });
            }
        }));

        await LEAVE.findOneAndUpdate({_id:leaveId,handover_by:mongoid},{$set:{status:'Approved'}})

        return res.status(200).json({ message: "Leave approved and relevant issues updated successfully.", status: 200 });
    } catch (err) {
        next(err);
    }
};


//Reject leave for employee
export const rejectLeave = async (req, res, next) =>{
    try{
        const { mongoid, userType } = req;
        if (!mongoid || !userType) {
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const {leaveId} = req.params
        if (!leaveId) return res.status(400).json({ message: "Please provide leave id.", status: 400 });

        const leave = await LEAVE.findOneAndUpdate({_id:leaveId,handover_by:mongoid},{status:"Rejected"})
        if(!leave) return res.status(404).json({message:"Leave is not found.",status:404})

        return res.status(200).json({message:"Leave rejected successfully.",status:200})
        
    }catch(err){
        next(err)
    }
}


//Delete leave 
export const deleteLeave = async (req, res, next)=>{
    try{
        const { mongoid, userType } = req;
        if (!mongoid || !userType) {
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const {leaveId} = req.params
        if (!leaveId) return res.status(400).json({ message: "Please provide leave id.", status: 400 });

        const leave = await LEAVE.findOne({_id:leaveId,added_by:mongoid})
        if(!leave) return res.status(404).json({message:"Leave not found.",status:404})

        if(leave.status!=='Pending') return res.status(400).json({message:"Leave can't be delete.",status:400})

        await LEAVE.findOneAndDelete({_id:leaveId,added_by:mongoid})

        return res.status(200).json({message:"Leave deleted successfully.",status:200,data:leave})
    }catch(err){
        next(err)
    }
}

//For Update leave
export const updateLeave = async (req, res, next) =>{
    try{
        const { mongoid, userType } = req;
        if (!mongoid || !userType) {
            return res.status(400).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });
        }

        const {leaveId} = req.params
        if (!leaveId) return res.status(400).json({ message: "Please provide leave id.", status: 400 });

        const leave = await LEAVE.findOne({_id:leaveId,added_by:mongoid})
        if(!leave) return res.status(404).json({message:"Leave not found.",status:404})

        if(leave.status!=='Pending') return res.status(400).json({message:"Leave can't be updated.",status:400})

        const updatedLeave = await LEAVE.findOneAndUpdate({_id:leaveId,added_by:mongoid},{$set:{...req.body}},{new:true})

        return res.status(200).json({message:"Leave updated successfully.",data:updatedLeave,status:200})

    }catch(err){
        next(err)
    }
}