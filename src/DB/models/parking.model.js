import mongoose, {Schema  , model    } from 'mongoose'

const carSchema= new Schema({
parkingNumber:{
    type:String,
    unique:[true,"parkingNumber must be unique"],
    required:[true,'parkingNumber is required'],
    trim:true,
    lowercase:true

},
parkingPrice:{
    type :String,
    required:[true,'parkingPrice is required'],

},
isAvilable:{
    type:Boolean,
    default:true
},
isDeleted:{
    type:Boolean,
    default:false
} 
},
{timestamps:true}
)


const carModel=mongoose.model.car||model('Car',carSchema)
export default carModel