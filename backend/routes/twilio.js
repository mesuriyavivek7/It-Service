import express from 'express'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'
import { createConfiguration, getConfiguration, updateConfiguration } from '../controller/twilioController.js'

const app = express.Router()

//For create configuration
app.post('/',verifyToken,verifyAdmin,createConfiguration)


//For update configuration
app.put('/',verifyToken,verifyAdmin,updateConfiguration)


//For get configuration
app.get('/',verifyToken,verifyAdmin,getConfiguration)


export default app