import express from 'express'
import { sendMailToEmployee } from '../controller/mailController.js'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'


const app = express.Router()


//For sending mail to employee when account create
app.post('/send-employee-register/:empId',verifyToken, verifyAdmin, sendMailToEmployee)


export default app