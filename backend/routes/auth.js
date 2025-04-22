import express from 'express'
import { changeCurrentPassword, loginPortal, logoutPortal, validateUser } from '../controller/authController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const app = express.Router()

//For login User with web portal
app.post('/login',loginPortal)

//For validaiton portal users
app.get('/validateuser',validateUser)

//For change current password of Admin , user , employee
app.post('/change-password',verifyToken,changeCurrentPassword)

//For Logout user into portal
app.get('/logout',logoutPortal)

export default app
