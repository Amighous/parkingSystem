import mongoose, {Schema  , model    } from 'mongoose'

const parkingSchema= new Schema({
parkingNumber:{
    type:String,
    unique:[true,"parkingNumber must be unique"],
    required:[true,'parkingNumber is required'],
    trim:true,
    lowercase:true

},
parkingDetails:{
    type:String,
    required:[true,'parkingNumber is required'],
    trim:true,
    lowercase:true

},
parkingPrice:{
    type :String,
    required:[true,'parkingPrice is required'],

},
status:{
    type:String,
    enum:['busy','empty'],
    default:'empty'
},
garageGate:{
    type:Boolean,
    default:false
},
isDeleted:{
    type:Boolean,
    default:false
} 
},
{timestamps:true}
)


const parkingModel=mongoose.model.car||model('Parking',parkingSchema)
export default parkingModel