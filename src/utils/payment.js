import Stripe from "stripe";
async function payment({
    payment_method_types=['card'],
    mode="payment",
    success_url=process.env.SUCCESS_URL,
    cancel_url=process.env.CANCEL_URL,
    discounts=[],
    customer_email,
    line_items=[],
    metadata={}
}={}) {

 const stripe = new Stripe(process.env.PAYMENT_KEY) 
 const session =  await stripe.checkout.sessions.create({

    payment_method_types,
    mode,
    success_url ,
    cancel_url ,
    discounts ,
    customer_email ,
    line_items,
    metadata

})
return session;
}
export default payment;