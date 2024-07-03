import axios from "axios";
import parkingModel from "../../../DB/models/parking.model.js";
import gateModel from "../../../DB/models/gate.model.js";

  

export const moduleContinuous = async (req, res, next) => {
   const startTime = Date.now();
   const duration = 10* 60 * 60 * 1000; // 5 hours in milliseconds
    const executeTask = async () => {
       
           // Access the data from module
           const response = await axios.get('http://127.0.0.1:5000/free_spaces');

           // Filteration function for next use
           function filterArray(array1, array2) {
               return array1.filter(item => !array2.includes(item));
           }

           // Update the status of empty places
           const moduleArray = response.data.free_spaces;
           await parkingModel.updateMany(
               { parkingNumber: { $in: moduleArray } },
               { $set: { status: 'empty' } }
           );

           // Get one property to check by it
           const databaseArray = await parkingModel.find();
           const namesArray = databaseArray.map(item => item.parkingNumber);

           // Doing filtration to update busy places
           const newArry = filterArray(namesArray, moduleArray);
           await parkingModel.updateMany(
               { parkingNumber: { $in: newArry } },
               { $set: { status: 'busy' } }
           );

           // Check if 5 hours have passed
           if (Date.now() - startTime < duration) {
            // console.log(startTime);
            // console.log(duration);
            // console.log(Date.now() );
               setTimeout(executeTask, 5000); // Run again after 10 seconds
           } else {
              return res.json({
                   message: "Completed 5 hours of execution",
                   free_spacesLength: response.data.free_spaces.length,
                   free_spaces: newResult
               });
           }
       
   };

   executeTask(); // Start the first execution
};



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
export const getFreeSpaces= async(req,res,next)=>{

   // Get the places which are empty and get only the places of it, not all collection
   const result = await parkingModel.find({ status: 'empty' });
   const newResult = result.map(item => item.parkingNumber);

   return  res.json({ message:"get free spaces",
            free_spacesLength: newResult.length,
            free_spaces: newResult
      });    

}
export const bestCell= async(req,res,next)=>{

   // Get the places which are empty and get only the places of it, not all collection
   const result = await parkingModel.find({ status: 'empty' });
   const newResult = result.map(item => item.parkingNumber);

   return  res.json({ message:"get free spaces",
            free_spacesLength: newResult.length,
            free_spaces: newResult
      });    

}