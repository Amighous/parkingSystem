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

   const result = await parkingModel.find({ status: 'empty' });
   const dataSet = result.map(item => item.parkingNumber);

const regions = {
   1: ["0-1", "1-1", "2-1"],
   2: ["0-2", "1-2", "2-2"],
   3: ["0-0", "1-0"],
   4: ["0-3", "1-3"],
   5: ["3-1", "4-1"],
   6: ["3-2", "4-2"],
   7: ["2-0", "3-0", "4-0"],
   8: ["2-3", "3-3", "4-3"]
};

function checkRegions(dataSet, regions) {
   for (const [regionId, regionPoints] of Object.entries(regions)) {
       for (const point of regionPoints) {
           if (dataSet.includes(point)) {
            switch (point) {
               // REGION 1
               case "0-1":
                   return  {
                     element: "first cell - A2",
                     region: 1,
                     message: "اتجه الي الامام ثم المربع الاول علا اليمين"
                 };
               case "1-1":
                   return  {
                     element: "second cell - A2",
                     region: 1,
                     message: "اتجه الي الامام ثم المربع الثاني علا اليمين"
                 };
               case "2-1":
                   return  {
                     element: "third cell - A2",
                     region: 1,
                     message: "اتجه الي الامام ثم المربع الثالث علا اليمين"
                 };
               // REGION 2
               case "0-2":
                   return  {
                     element: "first cell - B2",
                     region: 2,
                     message: "اتجه الي الامام ثم المربع الاول علا اليسار"
                 };
               case "1-2":
                   return  {
                     element: "second cell - B2",
                     region: 2,
                     message: "اتجه الي الامام ثم المربع الثاني علا اليسار"
                 };
               case "2-2":
                   return  {
                     element: "third cell - B2",
                     region: 2,
                     message: "اتجه الي الامام ثم المربع الثالث علا اليسار"
                 };
               // REGION 3
               case "0-0":
                   return  {
                     element: "first cell - A1",
                     region: 3,
                     message: "اتجه الي اقصا اليمين ثم المربع الاول  "
                 };
               case "1-0":
                   return  {
                     element: "second cell - A1",
                     region: 3,
                     message: "اتجه الي اقصا اليمين ثم المربع الثاني  "
                 };
               // REGION 4
               case "0-3":
                   return  {
                     element: "first cell - B2",
                     region: 4,
                     message: "اتجه الي اقصا اليسار ثم المربع الاول  "
                 };
               case "1-3":
                   return  {
                     element: "second cell - B2",
                     region: 4,
                     message: "اتجه الي اقصا اليسار ثم المربع الثاني  "
                 };
               // REGION 5
               case "3-1":
                   return  {
                     element: "fourth cell - A2",
                     region: 5,
                     message: "اتجه الي الامام ثم المربع الرابع علا اليمين  "
                 };
               case "4-1":
                   return  {
                     element: "fivth cell - A2",
                     region: 5,
                     message: "اتجه الي الامام ثم المربع الخامس علا اليمين  "
                 };
               // REGION 6
               case "3-2":
                   return  {
                     element: "fourth cell - B1",
                     region: 6,
                     message: "اتجه الي الامام ثم المربع الرابع علا اليسار  "
                 };
               case "4-2":
                   return  {
                     element: "fivth cell - B1",
                     region: 6,
                     message: "اتجه الي الامام ثم المربع الخامس علا اليسار  "
                 };
               // REGION 7
               case "2-0":
                   return  {
                     element: "third cell - B1",
                     region: 7,
                     message: "اتجه الي اقصا اليمين ثم المربع الثالث    "
                 };
               case "3-0":
                   return  {
                     element: "fourth cell - B1",
                     region: 7,
                     message: "اتجه الي اقصا اليمين ثم المربع الرابع    "
                 };
               case "4-0":
                   return  {
                     element: "fivth cell - B1",
                     region: 7,
                     message: "اتجه الي اقصا اليمين ثم المربع الخامس    "
                 };
               // REGION 8
               case "2-3":
                   return  {
                     element: "third cell - B1",
                     region: 8,
                     message: "اتجه الي اقصا اليسار ثم المربع الثالث    "
                 };
               case "3-3":
                   return  {
                     element: "fourth cell - B1",
                     region: 8,
                     message: "اتجه الي اقصا اليسار ثم المربع الرابع    "
                 };
               case "4-3":
                   return  {
                     element: "fivth cell - B1",
                     region: 8,
                     message: "اتجه الي اقصا اليسار ثم المربع الخامس    "
                 };
              
               default:
                   return `Element "${point}" achieved in Region ${regionId}`;
           }

           }
       }
   }
   return 'No element achieved in any region';
}

const dataresult = checkRegions(dataSet, regions);
 
   return  res.json({ message:"get free spaces",
            free_spacesLength: dataSet.length,
            free_spaces: dataSet,
            bestCellIs:dataresult
      });    

}