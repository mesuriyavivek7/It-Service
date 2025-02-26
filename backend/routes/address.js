import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js'
import { createAddress, deleteAddress, getAllAddress, updateAddress } from '../controller/addressController.js'

const app = express.Router()


//For create address
app.post('/',verifyToken,createAddress)

//For get all address by user or employee
app.get('/',verifyToken,getAllAddress)

//For update address
app.put('/:addressId',verifyToken,updateAddress)

//For delete address
app.delete('/:addressId',verifyToken,deleteAddress)


export default app