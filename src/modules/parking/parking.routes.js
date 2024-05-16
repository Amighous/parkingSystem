import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as parkingController from './controller/parking.controller.js'

const router=Router()
router.get('/free_spaces',
             asyncHandler(parkingController.module))
    .patch('/updateParkingPrice',
             asyncHandler(parkingController.updateParkingPrice))
    .post('/newParking',
              asyncHandler(parkingController.newParking))
    .get('/parkingPrice',
              asyncHandler(parkingController.parkingPrice))
export default router     



 