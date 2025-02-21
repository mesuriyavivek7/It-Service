import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createDevice, deleteDevice, getAllDevice, updateDevice } from "../controller/deviceController.js";

const app = express.Router()


//for create device 
app.post('/',verifyToken,createDevice)

//for get all device by user
app.get('/',verifyToken,getAllDevice)

//for update device by user
app.put('/',verifyToken,updateDevice)

//for delete device by user
app.delete('/',verifyToken,deleteDevice)


export default app