import EMPLOYEE from "../model/EMPLOYEE.js";
import ISSUE from "../model/ISSUE.js";
import LOGINMAPPING from "../model/LOGINMAPPING.js";
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

    if(!mongoid) return res.status(401).json({ message: "Unauthorized request: Missing user ID or user Type", status: 400 });

    const employee = await EMPLOYEE.findById(mongoid)

    if(!employee) return res.status(404).json({message:"Employee not found.",status:404})

    return res.status(200).json({message:"Employee details retrived.",data:employee,status:200})
  }catch(err){
    next(err)
  }
}

export const getAllEmployee = async (req, res, next) =>{
  try{
    const employee = await EMPLOYEE.find()

    return res.status(200).json({message:"All employee retrived.",data:employee,status:200})
  }catch(err){
    next(err)
  }
}

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

    // Fetch all employees
    const employees = await EMPLOYEE.find({ availability: true });

    // Filter available employees
    const availableEmployees = await Promise.all(
      employees.map(async (emp) => {
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

    if(!empId) return res.status(400).json({message:"Employeeid is required."})

    const employee = await EMPLOYEE.findById(empId).populate('assignedIssues')

    if(!employee) return res.status(200).json({message:"Employee is not found.",status:200})

    return res.status(200).json({message:"All issues retrived.",status:200,data:employee.assignedIssues})

  }catch(err){
    next(err)
  }
}