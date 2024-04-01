import joi from "joi";
import { generalFileds } from "../../utils/generalFileds.js";


export const signUpSchema = joi.object({
name:generalFileds.name.required(), 
userName:generalFileds.name.required(),
email:generalFileds.email.required(),
password:generalFileds.password.required(),
cPassword:generalFileds.cPassword.required(),
phoneNumber:joi.string().pattern(new RegExp(/^01[0125]\d{8}$/) ).required()
}).required()


export const tokenSchema = joi.object().keys({
    token: joi.string().min(3).max(200).required()
});


export const logInSchema = joi.object().keys({
    email:generalFileds.email.required(),
    password:generalFileds.password.required()
});

export const sendCodeSchema = joi.object().keys({
    email:generalFileds.email.required(),

});

export const forgetPasswordSchema = joi.object({
    email:generalFileds.email.required(),
    password:generalFileds.password.required(),
    cPassword:generalFileds.cPassword.required(),
    code:joi.string().pattern(new RegExp(/^[0-9]{6}$/)).required(),
}).required()
    