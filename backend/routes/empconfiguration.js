import express from 'express'
import { verifyToken, verifyAdmin } from '../middlewares/authMiddleware.js'
import { createDepartment, createDesignation, getAllDepartments, getAllDesignation } from '../controller/empConfigurationController.js'

const app = express.Router()

//For create new designation
app.post('/create-designation', verifyToken, verifyAdmin, createDesignation)

//For create new department
app.post('/create-department', verifyToken, verifyAdmin, createDepartment)

//For get all designation
app.get('/get-designations', verifyToken, verifyAdmin, getAllDesignation)

//For get all department
app.get('/get-departments', verifyToken, verifyAdmin, getAllDepartments)


export default app