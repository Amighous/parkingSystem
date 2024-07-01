import mongoose, { Schema } from 'mongoose';

const visaSchema = new Schema({
    visName: {
        type: String,
        required: true,
        trim: true // Remove leading/trailing whitespace
    },
    cardNumber: {
        type: String,
        required: true,
        trim: true, // Remove leading/trailing whitespace
        minlength: 16, // Example: Visa card has 16 digits
        maxlength: 16,
        validate: {
            validator: function(v) {
                return /^\d{16}$/.test(v); // Validate format (16 digits)
            },
            message: props => `${props.value} is not a valid credit card number!`
        }
    },
    expireDate: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                // Validate format (MM/YY)
                return /^\d{2}\/\d{2}$/.test(v);
                
            },
            message: props => `${props.value} is not a valid expiration date! Use MM/YY format.`
        }
    },
    cvv: { 
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                // Validate CVV (3 or 4 digits)
                return /^\d{3,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid CVV number!`
        }
    },amount:{
        type: String,
        required: true
    }
}, { timestamps: true });

const visaModel = mongoose.model('Visa', visaSchema);

export default visaModel;
