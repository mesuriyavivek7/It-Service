import express from 'express'
import { loginPortal, validateUser } from '../controller/authController.js'

const app = express.Router()

//For login User with web portal
app.post('/login',loginPortal)

//For validaiton portal users
app.get('/validateuser',validateUser)



export default app
