import EMPLOYEE from "../model/EMPLOYEE.js";
import ISSUE from "../model/ISSUE.js";
import LOGINMAPPING from "../model/LOGINMAPPING.js";
import LEAVE from "../model/LEAVE.js";
import bcrypt from 'bcryptjs'

export const createNewEmployee = async (req, res, next) =>{
    try{
       const {mongoid, userType} = req
       if(!mongoid || !userType) return res.status(401).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });

       const {name, email, mobileno, password} = req.body

       if(!name || !email || !mobileno || !password) res.status(400).json({message:"Please provide all required fields.",status:400})

       const checkEmail = await LOGINMAPPING.findOne({email})

       if(checkEmail) return res.status(409).json({message:"Employee is alredy exist with same email address.",status:409})
 
       const checkMobileno = await LOGINMAPPING.findOne({mobileno})

       if(checkMobileno) return res.status(409).json({message:"Mobile no is already exist with same mobile no."})

       const newEmployee = new EMPLOYEE({
         name,
         email,
         mobileno,
         added_by:mongoid
       })

       const saltRounds = 10; // The higher the number, the stronger the hash
       const hashedPassword = await bcrypt.hash(password, saltRounds);
       
       await newEmployee.save()

       const newLoginMap = new LOGINMAPPING({
        mongoid:newEmployee._id,
        email,
        mobileno,
        password:hashedPassword,
        userType:"employee"
       })

       await newLoginMap.save()

       return res.status(200).json({message:"New employee created.",data:newEmployee,status:200})
    }catch(err){
        next(err)
    }
}

export const updateEmployee = async (req, res, next) => {
  try {
    const { mongoid } = req;

    if (!mongoid) {
      return res.status(401).json({
        message: "Unauthorized request: Missing user ID or user Type",
        status: 400,
      });
    }

    const { email, mobileno } = req.body;

    if (email) {
      const existEmployee = await LOGINMAPPING.findOne({ email });
      if (existEmployee) {
        return res.status(409).json({
          message: "Employee already exists with the same email address.",
          status: 409,
        });
      }
    }

    if (mobileno) {
      const existEmployee = await LOGINMAPPING.findOne({ mobileno });
      if (existEmployee) {
        return res.status(409).json({
          message: "Employee already exists with the same mobile number.",
          status: 409,
        });
      }
    }

    const updatedEmployee = await EMPLOYEE.findByIdAndUpdate(
      mongoid,
      { $set: { ...req.body } },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        message: "Employee not found.",
        status: 404,
      });
    }

    if (email || mobileno) {
      await LOGINMAPPING.findOneAndUpdate(
        { mongoid },
        { $set: { email, mobileno } },
        { new: true }
      );
    }

    return res.status(200).json({
      message: "Employee details updated.",
      data: updatedEmployee,
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};



export const getOneEmployee = async (req, res, next) =>{
  try{
    const {mongoid} = req

    if(!mongoid) return res.status(401).json({ message: "Unauthorized request: Missing user ID or user Type", status: 401 });

    const employee = await EMPLOYEE.findById(mongoid)

    if(!employee) return res.status(404).json({message:"Employee not found.",status:404})

    return res.status(200).json({message:"Employee details retrived.",data:employee,status:200})
  }catch(err){
    next(err)
  }
}

export const getAllEmployee = async (req, res, next) => {
  try {
    // Fetch all employees
    const employees = await EMPLOYEE.find();

    // Get issue statistics grouped by assigned employee
    const issueState = await ISSUE.aggregate([
      {
        $match: { assignedEmployee: { $ne: null }, status: "Resolved"  } // Ignore null values
      },
      {
        $group: {
          _id: "$assignedEmployee",
          completedIssues: { $sum: 1 }
        }
      }
    ]);

    // Convert issueStats array to an object for quick lookup
    const issueMap = issueState.reduce((acc, stat) => {
      acc[stat._id.toString()] = stat.completedIssues; // Store only count
      return acc;
    }, {});

    // Attach completedIssues count to each employee
    const employeeWithCompletedIssue = employees.map(employee => ({
      ...employee.toObject(),
      completedIssues: issueMap[employee._id.toString()] || 0 // Default to 0
    }));

    return res.status(200).json({
      message: "All employees retrieved.",
      data: employeeWithCompletedIssue,
      status: 200
    });
  } catch (err) {
    next(err);
  }
};


export const assignEmployeeToIssue = async (req, res, next)=>{
  try{
    const {mongoid} = req

    if(!mongoid) return res.status(401).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });

    const {employeeId, issueId} = req.body

    if(!employeeId || !issueId) return res.status(400).json({message:"Please provide employee id or issue id."})

    const employee = await EMPLOYEE.findById(employeeId)

    if(!employee) return res.status(404).json({message:"Employee is not found.",status:404})

    const issue = await ISSUE.findById(issueId)

    if(!issue) return res.status(404).json({message:"Issue is not found.",status:404})

    if(issue.status!=="Pending") return res.status(400).json({message:`Particuler issue is ${issue.status} by user so no need to assign any employee to this issue.`,status:400})
     
    await ISSUE.findByIdAndUpdate(issueId,{$set:{assignedEmployee:employeeId}},{new:true})

    await EMPLOYEE.findByIdAndUpdate(employeeId,{$addToSet:{assignedIssues:issueId}},{new:true})

    return res.status(200).json({message:"Successfully employed assigned to issue.",status:200})

  }catch(err){
    next(err)
  }
}

export const removeEmployeeFromIssue = async (req, res, next) =>{
   try{
      const {employeeId, issueId} = req.body

      if(!employeeId || !issueId) return res.status(400).json({message:"Please provide employee id or issue id."})

      const employee = await EMPLOYEE.findById(employeeId)
  
      if(!employee) return res.status(404).json({message:"Employee is not found.",status:404})
  
      const issue = await ISSUE.findById(issueId)

      if(!issue) return res.status(404).json({message:"Issue is not found.",status:404})

      if(issue.status==="Ongoing") return res.status(400).json({message:"Employee is ongoing for providing service.",status:400})

      await ISSUE.findByIdAndUpdate(issueId,{$set:{assignedEmployee:null}})

      await EMPLOYEE.findByIdAndUpdate(employeeId,{$pull:{assignedIssues:issueId}})

      return res.status(200).json({message:"Employee is removed from issue.",status:200})

   }catch(err){
    next(err)
   }
}

export const checkAvailibiltyOfEmployee = async (req, res, next) => {
  try {
    const { issueId } = req.params;

    if (!issueId)
      return res.status(400).json({ message: "Please provide issue ID.", status: 400 });

    const issue = await ISSUE.findById(issueId);

    if (!issue)
      return res.status(404).json({ message: "Issue not found.", status: 404 });

    const { time: issueTime, date: issueDate } = issue;

    if (issue.assignedEmployee)
      return res.status(400).json({ message: "Employee is already assigned to this issue.", status: 400 });

    const issueDateStart = new Date(issueDate);
    issueDateStart.setHours(0, 0, 0, 0);

    const issueDateEnd = new Date(issueDate);
    issueDateEnd.setHours(23, 59, 59, 999);

    // Fetch all employees
    const employees = await EMPLOYEE.find({ availability: true });

    // Get issue statistics grouped by assigned employee
    const issueState = await ISSUE.aggregate([
      {
        $match: { assignedEmployee: { $ne: null }, status: "Resolved"  } // Ignore null values
      },
      {
        $group: {
          _id: "$assignedEmployee",
          completedIssues: { $sum: 1 }
        }
      }
    ]);

    // Convert issueStats array to an object for quick lookup
    const issueMap = issueState.reduce((acc, stat) => {
      acc[stat._id.toString()] = stat.completedIssues; // Store only count
      return acc;
    }, {});

    // Attach completedIssues count to each employee
    const employeeWithCompletedIssue = employees.map(employee => ({
      ...employee.toObject(),
      completedIssues: issueMap[employee._id.toString()] || 0 // Default to 0
    }));

    // Filter available employees
    const availableEmployees = await Promise.all(
      employeeWithCompletedIssue.map(async (emp) => {
        const leaveExists = await LEAVE.findOne({
          added_by: emp._id,
          status: "Approved",
          from: { $lte: issueDateEnd }, 
          to: { $gte: issueDateStart },
        });

        if (leaveExists) return null;

        if (emp.assignedIssues.length === 0) return emp; // If no assigned issues, employee is available

        const existIssue = await ISSUE.find({
          _id: { $in: emp.assignedIssues },
          time: issueTime,
          $expr: {
            $and: [
              { $eq: [{ $year: "$date" }, { $year: issueDate }] },
              { $eq: [{ $month: "$date" }, { $month: issueDate }] },
              { $eq: [{ $dayOfMonth: "$date" }, { $dayOfMonth: issueDate }] },
            ],
          },
        });

        return existIssue.length === 0 ? emp : null;
      })
    );

    // Remove `null` values (employees who have conflicting issues)
    const filteredEmployees = availableEmployees.filter((emp) => emp !== null);

    return res.status(200).json({
      message: "Available employees fetched successfully.",
      data: filteredEmployees,
      status: 200,
    });
  } catch (err) {
    next(err);
  }
};


export const getIssuesByEmployeeId = async (req, res, next) =>{
  try{
    const {empId} = req.params

    if(!empId) return res.status(400).json({message:"Employeeid is required.",status:400})

    const employee = await EMPLOYEE.findById(empId).populate('assignedIssues')

    if(!employee) return res.status(200).json({message:"Employee is not found.",status:200})

    return res.status(200).json({message:"All issues retrived.",status:200,data:employee.assignedIssues})

  }catch(err){
    next(err)
  }
}

//For update employee details from admin side
export const updateEmployeeFromAdmin = async (req, res, next) =>{
  try{
    const {empId} = req.params

    if(!empId) return res.status(400).json({message:"Please provide employee id.",status:400})

    const employee = await EMPLOYEE.findById(empId)

    if(!employee) return res.status(404).json({message:"Employee is not found.",status:404})

    const {email, mobileno} = req.body

    let existEmail = null
    let existMobileno = null

    if(email && employee.email!==email){
       existEmail = await LOGINMAPPING.findOne({email})

       if(existEmail) return res.status(409).json({message:"Employee is already exist with same email address.",status:409})
    }

    if(mobileno && employee.mobileno!==mobileno){
       existMobileno = await LOGINMAPPING.findOne({mobileno})

       if(existMobileno) return res.status(409).json({message:"Employee is already exist with same mobileno.",status:409})
    }

    if(!existEmail && !existMobileno){
       await LOGINMAPPING.findOneAndUpdate({mongoid:empId},{$set:{email,mobileno}})
    }

    const updatedEmployee = await EMPLOYEE.findByIdAndUpdate(empId,{$set:{...req.body}},{new:true})
    
    return res.status(200).json({message:"Employee is updated successfully.",data:updatedEmployee,status:200})


  }catch(err){
    next(err)
  }
}


export const getAllIssuesForEmployee = async (req, res, next) =>{
  try{
    const {mongoid, userType} = req

    if(!mongoid || !userType){
        return res.status(401).json({message:"Unauthorized request: Missing user ID or user Type.",status:401})
    } 

    if(userType!=='employee') return res.status(401).json({message:"userType is invalid.",status:401})

    const {status} = req.query

    if(!status) {
      const allIssues = await ISSUE.find({assignedEmployee:mongoid}).sort({createdAt:-1})
      .populate('address')
      .populate('device')
      .populate('time')
      .populate('service')
      .populate('added_by')
      .populate('assignedEmployee')

      return res.status(200).json({message:"All issues retrived.",data:allIssues,status:200})
    }else {
      const filterIssues = await ISSUE.find({status:status,assignedEmployee:mongoid}).sort({createdAt:-1})
      .populate('address')
      .populate('device')
      .populate('time')
      .populate('service')
      .populate('added_by')
      .populate('assignedEmployee')

      return res.status(200).json({message:`${status} Issue retrived.`,data:filterIssues,status:200})
    }
    
  }catch(err){
    next(err)
  }
}