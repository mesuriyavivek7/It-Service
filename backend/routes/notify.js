import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getNotification } from '../controller/notifyController.js'


const app = express.Router()


//For get notification
app.get("/",verifyToken,getNotification)



export default app