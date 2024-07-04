import axios from "axios"
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
export const userEnters = async (req, res, next) => {
    const { mac } = req.body;
   
     // Update user status and record entry time
    await userModel.updateOne({ UserMac: mac }, { status: 'busy', timeInParking: Date.now(),cost:"0" });

    // Update gate status (assuming gateModel.updateOne({status:true}) updates gate status)
    await gateModel.updateOne({ status: true });

    return res.status(200).json({
        message: 'done',
        message2: "user is allowed",
        message3: "enter gate opened"
    });
}


export const userOuts = async (req, res, next) => {
    const { mac } = req.body;
     
    const user = await userModel.findOne({ UserMac: mac });
 
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Calculate time spent in parking
    const timeInParking = user.timeInParking;
    const date = new Date(timeInParking);
    const timestamp = date.getTime();


    

    const currentTime = Date.now();
 
    const timeSpentMillis = currentTime - timestamp;
 
    const timeSpentHours = timeSpentMillis / (1000 * 60    ); 
 
 
        const pricing = await gateModel.findOne();
        if (!pricing) {
            return res.status(404).json({ message: 'Pricing details not found' });
        }
 
        const parkingPricePerHour =  pricing.parkingPrice;
     // Calculate cost based on time spent
        const cost = parseInt(parkingPricePerHour * timeSpentHours);
     // Update user's cost in the database
    await userModel.updateOne({ UserMac: mac }, { cost: cost });
    const usercost =await userModel.findOne({ UserMac: mac });

 
    // Check if user has paid
  
    if (usercost.cost > 0) {

        let timeout = 300; 
        while (timeout > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            timeout--;

             const refreshedUser = await userModel.findOne({ UserMac: mac }); 
            
              

             if (refreshedUser.cost == 0) {
                 break;
            }
        }

        // After timeout or payment made, check again
        if (timeout <= 0 && usercost.cost !=0) {
            return res.status(400).json({
                message: 'Payment timeout exceeded. Please try again.',
             }); 
        }
    }

    // Update user status and reset entry time
    await userModel.updateOne({ UserMac: mac }, { status: 'empty', timeInParking: null });

    // Update gate status (assuming gateModel.updateOne({status:true}) updates gate status)
    await gateModel.updateOne({ status: true });

    return res.status(200).json({
        message: 'done',
        message2: "user is allowed",
        message3: "exit gate opened"
    });
        
      
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


  
export const redirect = async (req, res, next) => {
    const { mac } = req.body;
 
   
        const redirectUser = await userModel.findOne({ UserMac: mac });
 
        if (!redirectUser) {
            return next(new Error("Please login to verify your information"));
        }

        let response;
        if (redirectUser.status === 'empty') {
            response = await axios.post('https://parkingsystem-tp3t.onrender.com/sensor/userEnters', { mac });
            return res.status(response.status).json(response.data);

        }  
        response = await axios.post('https://parkingsystem-tp3t.onrender.com/sensor/userOuts', { mac });
          return res.status(response.status).json(response.data);
   
     }
 

