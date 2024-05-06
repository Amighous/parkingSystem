import axios from "axios";
import parkingModel from "../../../DB/models/parking.model.js";

  

export const module =async(req, res,next) => {
 //access the data from module
     const response = await axios.get('http://127.0.0.1:5000/free_spaces');


 //filteration function 
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
