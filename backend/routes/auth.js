import express from 'express'
import { loginPortal } from '../controller/authController.js'

const app = express.Router()

//For login User with web portal
app.post('/login',loginPortal)





export default app
