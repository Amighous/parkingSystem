import mongoose, {Schema , Types, model, mongo } from 'mongoose'

const gateSchema= new Schema({
gateName:{
    type:String,
    required:[true,'name is required'],
    lowercase:true,

},
parkingPrice:{
    type :String,
    required:[true,'parkingPrice is required'],

},
status:{
    type:Boolean,
    default:false
}

},
{timestamps:true}
)


const gateModel=mongoose.model.gate||model('Gate',gateSchema)
export default gateModel