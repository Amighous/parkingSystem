import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as sensorController from './controller/sensor.controller.js'

const router=Router()
router.post('/userEnters',
             asyncHandler(sensorController.userEnters))
    .post('/userOuts',
             asyncHandler(sensorController.userOuts))
    .post('/redirect',
             asyncHandler(sensorController.redirect))
    .post('/createGate',
             asyncHandler(sensorController.createGate))
    .patch('/openGate',
             asyncHandler(sensorController.openGate))
    .patch('/closeGate',
             asyncHandler(sensorController.closeGate))
    .get('/readDataBase/:gate',
             asyncHandler(sensorController.readDataBase))


export default router