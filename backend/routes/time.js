import express from 'express'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'
import { createTime, deleteTime, getAllTimes, updateTime } from '../controller/timeController.js'

const app = express.Router()

//For create new time 
app.post('/',verifyToken,verifyAdmin,createTime)

//For update time
app.put('/:timeId',verifyToken,verifyAdmin,updateTime)

//For get all time
app.get('/',verifyToken,getAllTimes)

//Delete time
app.delete('/:timeId',verifyToken,deleteTime)

export default app