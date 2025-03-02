import express from 'express'
import { createIssue, getOneIssue } from '../controller/issueController'
import { verifyToken } from '../middlewares/authMiddleware'

const app = express.Router()

//For create new issue 
app.post('/',verifyToken,createIssue)

//For get one issue
app.get('/:issueId',verifyToken,getOneIssue)



export default app