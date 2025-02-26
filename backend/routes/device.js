import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { createDevice, deleteDevice, getAllDevice, updateDevice } from "../controller/deviceController.js";

const app = express.Router()


//for create device 
app.post('/',verifyToken,createDevice)

//for get all device by user
app.get('/',verifyToken,getAllDevice)

//for update device by user
app.put('/:deviceId',verifyToken,updateDevice)

//for delete device by user
app.delete('/:deviceId',verifyToken,deleteDevice)


export default app