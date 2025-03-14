import express from 'express'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'
import { approveLeave, createLeave, deleteLeave, getAllLeaves, getEmpLeave, rejectLeave, updateLeave } from '../controller/leaveController.js'

const app = express.Router()

//For create new leave
app.post('/',verifyToken,createLeave)

//For get employee leave
app.get('/getempleave',verifyToken,getEmpLeave)

//For get all leaves
app.get('/',verifyToken,verifyAdmin,getAllLeaves)

//For update leave 
app.put('/:leaveId',verifyToken,updateLeave)

//For delete leave
app.delete('/:leaveId',verifyToken,deleteLeave)

//For approve leave
app.post('/approve/:leaveId',verifyToken,verifyAdmin,approveLeave)

//For reject leave
app.post('/reject/:leaveId',verifyToken,verifyAdmin,rejectLeave)


export default app