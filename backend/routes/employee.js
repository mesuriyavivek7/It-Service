import express from 'express'
import { assignEmployeeToIssue, checkAvailibiltyOfEmployee, createNewEmployee, getAllEmployee, getAllIssuesForEmployee, getDashboardSummary, getIssuesByEmployeeId, getOneEmployee, removeEmployeeFromIssue, updateEmployee, updateEmployeeFromAdmin } from '../controller/employeeController.js'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'

const app = express.Router()


//For create new employee
app.post('/',verifyToken,verifyAdmin,createNewEmployee)

//For update employee
app.put('/',verifyToken,updateEmployee)

//For get one employee
app.get('/getone',verifyToken,getOneEmployee)

//For get all employee
app.get('/',verifyToken,verifyAdmin,getAllEmployee)

//For assign employee to issue
app.post('/assigntoissue',verifyToken,verifyAdmin,assignEmployeeToIssue)

//For remoce employee from issue
app.post('/removeEmployeeFromIssue',verifyToken,verifyAdmin,removeEmployeeFromIssue)

//For check availability of employees 
app.get('/getAvailableEmployees/:issueId',verifyToken,verifyAdmin,checkAvailibiltyOfEmployee)

//For get issues of eny employee
app.get('/getissues/:empId',verifyToken,getIssuesByEmployeeId)

//For Update employee details from admin
app.put('/:empId',verifyToken,verifyAdmin,updateEmployeeFromAdmin)

//For get all issues
app.get('/getallIssue',verifyToken,getAllIssuesForEmployee)

//For get Dashboard summery for employee
app.get('/dashborad-summery',verifyToken, getDashboardSummary)

export default app