import express from 'express'
import { createUser, getAllUser, getUser, updateUser } from '../controller/userController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const app = express.Router()


//For creating new user
app.post('/',createUser)

//For Update user
app.put('/',verifyToken, updateUser)

//For Get all user
app.get('/',verifyToken, getAllUser)

//For Get only one user
app.get('/getone',verifyToken, getUser) 


export default app