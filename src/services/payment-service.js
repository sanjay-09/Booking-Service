const {AppError}=require("../utils/error/index");
const {SECRET_KEY}=require("../config/serverConfig")
const stripe=require("stripe")(SECRET_KEY);
async function createNewCustomer(data){
    try{
        console.log(data);
        const customer=await stripe.customers.create({
            name:data.name,
            email:data.userEmail
        })
        return customer;
    }
    catch(err){
        console.log(err);
        throw new Error("Stripe Payment service is down");

    }
}

async function addNewCard(data) {
    try {
    //   const card_Token = await stripe.tokens.create({
    //     card: {
    //       name: data.name,
    //       number: data.card_Number,
    //       exp_month: data.card_ExpMonth,
    //       exp_year: data.card_ExpYear,
    //       cvc: data.card_CVC,
    //     },
    //   });
  
      const card = await stripe.customers.createSource(data.customer_Id, {
        source: 'tok_mastercard'
      });
  
      return card;
    } catch (error) {
        console.log(error);
        throw error;
     
    }
}
async function createCharges(data) {
    try {
      const createCharge = await stripe.paymentIntents.create({
        amount: data.totalCost,
        currency: "inr",
        customer: data.customer_Id,
        description: "Flight Booking Payment Receipt",
      });
      return createCharge;
    } catch (error) {
    console.log(error);
        throw error;
    }
  }
  

    
module.exports={
    createNewCustomer,
    addNewCard,
    createCharges
}