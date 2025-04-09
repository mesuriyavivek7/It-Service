import express from 'express'
import { cancelIssue, createIssue, getAllIssues, getOneIssue, getOneIssueForAdmin, resolveIssue, startIssueWorking, verifyResolveIssue } from '../controller/issueController.js'
import { verifyAdmin, verifyToken } from '../middlewares/authMiddleware.js'
import upload from '../middlewares/multer.js'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'; // Import UUID to generate unique folder names

const app = express.Router()

const setUniqueFolder = (req, res, next) => {
    if (!req.uniqueFolder) {
        req.uniqueFolder = `uploads/issue/${uuidv4()}`; // Generate folder once per request
    }
    next();
};

//For create new issue 
app.post('/',verifyToken,setUniqueFolder,upload.array('issue',3),createIssue)

//For get all issues 
app.get('/',verifyToken,getAllIssues)

//For get one issue
app.get('/getone/:issueId',verifyToken,getOneIssue)

//For get one issue for admin
app.get('/getoneForAdmin/:issueId',verifyToken,getOneIssueForAdmin)

//For start issue working by employee
app.post('/startissue/:issueId',verifyToken,startIssueWorking)

//For Cancel issue
app.post('/cancelissue/:issueId',verifyToken,cancelIssue)

//Send otp for resolve issue
app.post('/sendotp/resolveissue/:issueId',verifyToken,resolveIssue)

//Verify otp for resolve issue
app.post('/verifyotp/resolveissue/:issueId',verifyToken,verifyResolveIssue)



export default app