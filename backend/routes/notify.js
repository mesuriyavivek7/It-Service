import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { getNotification, markAsRead } from '../controller/notifyController.js'


const app = express.Router()


//For get notification
app.get("/",verifyToken,getNotification)

//For mark as read notification
app.post('/:id',verifyToken,markAsRead)

export default app