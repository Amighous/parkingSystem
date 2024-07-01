import mongoose, {Schema , Types, model, mongo } from 'mongoose'

const userSchema= new Schema({
name:{
    type:String,
    required:[true,'name is required'],
    lowercase:true,
    min:[3,'min length 3 char'],
    max:[20,'max length 20 char']

},
userName:{
    type:String,
    unique:[true,"userName must be unique"],
    required:[true,'userName is required'],
    trim:true,
    lowercase:true,
    min:[3,'min length 3 char'],
    max:[10,'max length 10 char']

},
email:{
    type:String,
    unique:[true,"emali must be unique"],
    required:[true,'emali is required'],
    trim:true,
    lowercase:true
},
recoveryEmail :{
    type:String,
    trim:true,
    lowercase:true
},
password:{
    type:String,
    required:[true,'password is required'],

},
role:{
    type:String,
    enum:['User','Admin'],
    default:'User'
},
status:{
    type:String,
    enum:['busy','empty'],
    default:'empty'
},
cost:{
    type:String,
     default:'paied'
},
confirmEmail:{
    type:Boolean,
    default:false
},
isDeleted:{
    type:Boolean,
    default:false
},
passwordChangedAt:{
    type: Date,
    default: Date.now,
},
timeInParking:{
    type: Date,
 },
phoneNumber:String,
UserMac:String,
image:Object,
code:String,
},
{timestamps:true}
)


const userModel=mongoose.model.User||model('User',userSchema)
export default userModel