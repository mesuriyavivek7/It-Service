import express from 'express'
import { createUser, getAllUser, getUser, updateUser, updateUserFromApplication } from '../controller/userController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'

const app = express.Router()


//For creating new user
app.post('/',createUser)

//For update user info from application
app.put('/updateFromApp',verifyToken,upload.single('user'),updateUserFromApplication)

//For Update user in web portal
app.put('/:userId',verifyToken, updateUser)

//For Get all user
app.get('/',verifyToken, getAllUser)

//For Get only one user
app.get('/getone',verifyToken, getUser) 







export default app