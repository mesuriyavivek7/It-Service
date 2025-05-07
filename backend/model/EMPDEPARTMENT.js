import mongoose from 'mongoose'


const empDepartmentSchema = new mongoose.Schema({
     department_name:{
        type:String,
        required:true
     }
})


export default mongoose.model("empdepartment",empDepartmentSchema)