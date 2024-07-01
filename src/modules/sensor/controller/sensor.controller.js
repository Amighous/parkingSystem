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
    const result = await userModel.findOne({ UserMac: mac });

    if (!result) {
        return next(new Error("Please login to verify your information"));
    }

    // Update user status and record entry time
    await userModel.updateOne({ UserMac: mac }, { status: 'busy', timeInParking: Date.now() });

    // Update gate status (assuming gateModel.updateOne({status:true}) updates gate status)
    await gateModel.updateOne({ status: true });

    return res.status(200).json({
        message: 'done',
        message2: "user is allowed",
        message3: "gate opened"
    });
}


export const userOuts = async (req, res, next) => {
    const { mac } = req.body;

    
        const user = await userModel.findOne({ UserMac: mac });

        if (!user) {
            return next(new Error("Please login to verify your information"));
        }

        // Calculate time spent in parking
        const timeInParking = user.timeInParking;
        const currentTime = Date.now();
        const timeSpentMillis = currentTime - timeInParking;
        const timeSpentHours = timeSpentMillis / (1000 * 60 * 60); // Convert milliseconds to hours

        // Fetch pricing details (assuming it's stored in a database)
        const pricing = await gateModel.findOne();
        const parkingPricePerHour = pricing.parkingPrice;

        // Calculate cost based on time spent
        const cost = parkingPricePerHour * timeSpentHours;

        // Update user's cost in the database
        await userModel.updateOne({ UserMac: mac }, { cost: cost });

        // Check if user has paid
        const hasPaid = user.cost >= cost; // Assuming user's current cost is updated correctly

        if (!hasPaid) {
            // Loop until payment is made or timeout
            let timeout = 300; // Timeout in seconds (adjust as needed)
            while (timeout > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                timeout--;

                // Refresh user data to check if payment status has changed
                const refreshedUser = await userModel.findOne({ UserMac: mac });
                if (refreshedUser.cost >= cost) {
                    break; // Exit loop if payment is made
                }
            }

            // After timeout or payment made, check again
            if (timeout <= 0 && !hasPaid) {
                return res.status(400).json({
                    message: 'Payment timeout exceeded. Please try again.',
                    paymentRequired: cost - user.cost // Additional amount required to pay
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
            message3: "gate opened"
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
