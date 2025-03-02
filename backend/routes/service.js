import express from 'express'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'
import { createService, getAllServices, updateService } from '../controller/serviceController.js'
import upload from '../middlewares/multer.js'

const app = express.Router()


//For create new service 
app.post('/',verifyToken,verifyAdmin,upload.single('service'),createService)

//For get all service 
app.get('/',verifyToken,getAllServices)

//For update service 
app.put('/:serviceid',verifyToken,verifyAdmin,upload.single('service'),updateService)


export default app