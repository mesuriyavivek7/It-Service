import express from 'express'
import { sendOtp, verifyOtp } from '../controller/otpController.js'


const app = express.Router()


//Send otp for login
app.post('/send-otp',sendOtp)


//Verify otp for login
app.post('/verify-otp',verifyOtp)

export default app