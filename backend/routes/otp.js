import express from 'express'
import { sendOtp, sendOtpForCreateUser, verifyOtp, verifyOtpForCreateUser } from '../controller/otpController.js'


const app = express.Router()


//Send otp for login
app.post('/send-otp',sendOtp)

//Verify otp for login
app.post('/verify-otp',verifyOtp)

//Send otp for sign up 
app.post('/signup-otp',sendOtpForCreateUser)

//Verify otp for sign up user
app.post('/signup-otp/verify',verifyOtpForCreateUser)

export default app