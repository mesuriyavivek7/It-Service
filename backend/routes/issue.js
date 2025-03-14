import express from 'express'
import { cancelIssue, createIssue, getAllIssues, getOneIssue, resolveIssue, verifyResolveIssue } from '../controller/issueController.js'
import { verifyToken } from '../middlewares/authMiddleware.js'

const app = express.Router()

//For create new issue 
app.post('/',verifyToken,createIssue)

//For get all issues 
app.get('/',verifyToken,getAllIssues)

//For get one issue
app.get('/getone/:issueId',verifyToken,getOneIssue)

//For Cancel issue
app.post('/cancelissue/:issueId',verifyToken,cancelIssue)

//Send otp for resolve issue
app.post('/sendotp/resolveissue/:issueId',verifyToken,resolveIssue)

//Verify otp for resolve issue
app.post('/verifyotp/resolveissue/:issueId',verifyToken,verifyResolveIssue)



export default app