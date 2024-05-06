import gateModel from "../../../DB/models/gate.model.js"
 import userModel from "../../../DB/models/user.model.js"
 
////createGate/////
export const createGate=async(req,res,next)=>{
    const {name}=req.body
    const result= await gateModel.findOne({gateName:name})
    if(result){
        return next(new Error("this name already exist"))
    }
    await gateModel.create({gateName:name})
    
    return res.status(200).json({message:'done',message2:"gate added successfully"})
}



/////openGate
export const openGate=async(req,res,next)=>{
    const {name}=req.body

    const result= await gateModel.findOne({gateName:name})
    if(!result){
        return next(new Error("that is not a true name"))
    }
    
    await gateModel.updateOne({status:true})
    return res.status(200).json({message:'done',message2:"gate opened"})
}
/////closeGate
export const closeGate=async(req,res,next)=>{
    const {name}=req.body

    const result= await gateModel.findOne({gateName:name})
    if(!result){
        return next(new Error("that is not a true name"))
    }
 
    await gateModel.updateOne({status:false})
    return res.status(200).json({message:'done',message2:"gate closed"})
}



///read from sensor// CHECK IS USER LOGIN AND CHANGE STATUS TO BUSY
export const readSensor=async(req,res,next)=>{
    const {mac}=req.body
    const result= await userModel.findOne({UserMac:mac})
    if(!result){
        return next(new Error("please login to verify your information"))
    }
    await userModel.updateOne({UserMac:mac},{status:'busy'})

    await gateModel.updateOne({status:true})
    return res.status(200).json({message:'done',message2:"user is allowed",message3:"gate opened"})

}

  

///readDataBase// TAKE DATA FROM DATA BASE AND SEND IT TO IOT TO TO OPEN OR COLSE
export const readDataBase=async(req,res,next)=>{
    const {gate}=req.params
     const result= await gateModel.findOne({gateName:gate})
    if(!result){
        return next(new Error("there are no gates like this name"))
    }
    const forSensor= result.status
    return res.status(200).json({message:'done',forSensor})

}
