import joi from "joi"
import { generalFileds } from "../../utils/generalFileds.js"

export const tokenSchema = joi.object({
    authorization:joi.string().required()
}).required()
 
export const userUdateSchema = joi.object({
    _id:generalFileds._id,
    name:generalFileds.name, 
    email:generalFileds.email,
    userName:generalFileds.name,
    phoneNumber:joi.string().pattern(new RegExp(/^01[0125]\d{8}$/) )
    }).required()
export const userEmailSchema = joi.object({
    email:generalFileds.email
}).required()

export const passwordSchema = joi.object({
    oldPassword:generalFileds.password.required(),
    newPassword:generalFileds.password.required()
}).required()

