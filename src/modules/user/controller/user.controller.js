import userModel from "../../../DB/models/user.model.js";
import { hash, verfiy } from "../../../utils/hashing.js";

 


export const updateUser = async(req,res,next)=>{
  const { _id } = req.user
  const { email , phoneNumber   , userName ,name } = req.body;
  const user = await userModel.findOne({email})

  //check if email exist
  if(user.email !=req.user.email ){
    return next(new Error("email already exist"))
  }

  const userupdate = await userModel.findByIdAndUpdate(_id, { email , phoneNumber , userName , name  }, { new: true });
   return res.json({ message: 'User updated successfully', userupdate });
} 

//end point used by admin
export const updateUserData = async(req,res,next)=>{
  const { _id } = req.body
  const { email , phoneNumber   , userName ,name } = req.body;
  const user = await userModel.findOne({email})

  //check if email exist
  if(user.email !=req.user.email ){
    return next(new Error("email already exist"))
  }

  const userupdate = await userModel.findByIdAndUpdate(_id, { email , phoneNumber , userName , name  }, { new: true });
  if(userupdate == null ){
    return next(new Error("user not updated"))
  }
  const returnData= await userModel.findById(_id).select('_id name userName email phoneNumber role')
   return res.json({ message: 'User updated successfully', returnData });
} 





///////////delete//////////
export const deleteUser = async(req,res,next)=>{
  const { _id } = req.user
   await userModel.deleteOne( {_id} )
  
    return res.json({ message: 'User deleted successfully' })
}


///////Get user account data //////////
// export const getUserData =async(req,res,next)=>{
//   const { email } = req.user
//   const user = await userModel.find(email).select(' -password' )
//   return res.json({message:'done',user})
// }

 

//////Get   data   user ////
export const getUserData =async(req,res,next)=>{
  const { email } = req.body
  const user = await userModel.findOne({ email })
            .select(' name phoneNumber _id userName email')
  if (!user){
    return next(new Error("User not found"))
  }
  return res.json({message:'done',user})
}



/////////update password//////////////
export const updatePassword= async (req, res, next) => {
    const { _id } = req.user
    const { oldPassword, newPassword } = req.body;
    const userchange = await userModel.findById({_id});
    const match =verfiy({plainText:oldPassword,hashValue:userchange.password})
    if(!match){
        return  next(new Error('Invalid old password',{cause:404}))

    }    
    
    let password=hash({plainText:newPassword})
    const updateUser = await userModel.findOneAndUpdate({_id},{password,passwordChangedAt: Date.now(),status:"offline"},{new:true})
    return  res.json({ message: 'Password updated successfully' });
}

 
export const getMac=async(req,res,next) => {
  const { macAddress } = req.body; // Assuming the MAC address is sent in the request body
   const user = await userModel.create({UserMac :`${macAddress}`})
  
   
  return res.status(200).send('MAC address received successfully.');
}