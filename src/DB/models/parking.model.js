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
    required:[true,'parkingDetails is required'],
    trim:true,
    lowercase:true

},
status:{
    type:String,
    enum:['busy','empty'],
    default:'empty'
},
isDeleted:{
    type:Boolean,
    default:false
} 
},
{timestamps:true}
)


const parkingModel=mongoose.model.parking||model('Parking',parkingSchema)
export default parkingModel