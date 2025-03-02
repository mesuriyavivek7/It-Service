import express from 'express'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'
import { createAdmin, getOneAdmin, removeAdmin, updateAdmin } from '../controller/adminController.js'

const app = express.Router()


//For create new admin
app.post('/',createAdmin)

//For get one admin
app.get('/',verifyToken,verifyAdmin,getOneAdmin)

//For update admin
app.put('/',verifyToken,verifyAdmin,updateAdmin)

//For delete admin
app.delete('/',verifyToken,verifyAdmin,removeAdmin)


export default app
