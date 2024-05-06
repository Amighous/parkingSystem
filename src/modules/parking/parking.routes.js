import { Router } from "express";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as parkingController from './controller/parking.controller.js'

const router=Router()
router.get('/free_spaces',
             asyncHandler(parkingController.module));

export default router     



// router.post('/newParking',
//              asyncHandler(parkingController.newParking))
// router.post('/insert',
//              asyncHandler(parkingController.insertParking))

