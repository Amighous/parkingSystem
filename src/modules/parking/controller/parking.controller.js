import axios from "axios";
import parkingModel from "../../../DB/models/parking.model.js";
import gateModel from "../../../DB/models/gate.model.js";

  

export const module =async(req, res,next) => {
 //access the data from module
     const response = await axios.get('http://192.168.167.111:5000/free_spaces');


 //filteration function for next use
    function filterArray(array1, array2) {
        
        return array1.filter(item => !array2.includes(item));
    }

 //in this we updated the status of empty places
    const moduleArray=response.data.free_spaces
    await parkingModel.updateMany(
        { parkingNumber: { $in: moduleArray } }, 
        { $set: { status: 'empty' } });

 //here i get one property to check by it         
    const databaseArray=await parkingModel.find()
    const namesArray = databaseArray.map(item => item.parkingNumber);

 //doing filtration to update busy places
    const newArry=filterArray(namesArray,moduleArray)
    await parkingModel.updateMany(
        { parkingNumber: { $in: newArry } }, 
        { $set: { status: 'busy' } });

 //get the places which is empty and get the only places of it ,not all collection 
    const result = await parkingModel.find({status:'empty'})
    const newResult = result.map(item => item.parkingDetails);

 //the response
    return res.json({   
            free_spacesLength : response.data.free_spaces.length,
            free_spaces : newResult
        });    
}

//update price
export const updateParkingPrice= async(req,res,next)=>{
   const {parkingPrice}=req.body
   await gateModel.updateMany({}, { $set: { parkingPrice: parkingPrice } })
   const newPrice =await gateModel.findOne({parkingPrice})
    return  res.json({ newPrice:`new price is ${newPrice.parkingPrice}`});    
}
 

//insert new parking
export const newParking= async(req,res,next)=>{
   const {gateName}=req.body
   if(await  gateModel.findOne({gateName:gateName})){
      return next(new Error("name already exist"))
   }
   const neww = await gateModel.findOne({})

    await  gateModel.create({gateName:gateName,parkingPrice:neww.parkingPrice})

    return  res.json({ message:`done `});    
}

//get price 
export const parkingPrice= async(req,res,next)=>{
   const neww = await gateModel.findOne({})
   return  res.json({ message:`parking price is ${neww.parkingPrice} `});    

}