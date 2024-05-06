import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as sensorController from './controller/sensor.controller.js'

const router=Router()
router.post('/sensor',
             asyncHandler(sensorController.readSensor))
    .post('/createGate',
             asyncHandler(sensorController.createGate))
    .patch('/openGate',
             asyncHandler(sensorController.openGate))
    .patch('/closeGate',
             asyncHandler(sensorController.closeGate))
    .get('/readDataBase/:gate',
             asyncHandler(sensorController.readDataBase))


export default router