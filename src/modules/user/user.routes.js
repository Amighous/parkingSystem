import {Router} from 'express'
import * as userController from './controller/user.controller.js'
import * as userValidation from './user.validation.js'
import { auth } from '../../middleware/auth.js';
import { asyncHandler } from '../../utils/errorHandling.js';
import userEndPoints from './user.endPoints.js';
import validation from '../../utils/validation.js';
const router=Router()
router.patch('/updateUser',
        validation(userValidation.tokenSchema,true),
        auth(userEndPoints.update),
        validation(userValidation.userUdateSchema),
        asyncHandler(userController.updateUser))

    .delete('/deleteUser',
        validation(userValidation.tokenSchema,true),
        auth(userEndPoints.delete),
        asyncHandler(userController.deleteUser))

    .get('/getUserData',
        validation(userValidation.tokenSchema,true),
        auth(userEndPoints.get),
        asyncHandler(userController.getUserData))

    .get('/getAnotherAccount',
        validation(userValidation.tokenSchema,true),
        auth(userEndPoints.get),
        asyncHandler(userController.getAnotherAccount))

    .patch('/updatePassword',
        validation(userValidation.tokenSchema,true),
        auth(userEndPoints.update),
        validation(userValidation.passwordSchema),
        asyncHandler(userController.updatePassword))

export default router 

 
 