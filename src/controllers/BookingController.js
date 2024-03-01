const {BookingService}=require("../services/index");
const bookingService=new BookingService();
const {createChannel,publishMessage}=require("../utils/messageQueue");
const {REMINDER_BINDING_KEY}=require("../config/serverConfig")
const PaymentGateway=require("../services/payment-service");


const sendMessageToQueue=async(req,res)=>{
    try{
        const channel=await createChannel();
        const data = {message: 'Success'};
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));
        return res.status(200).json({
            message: 'Succesfully published the event'
        });

    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            data:{},
            message:"Cannot send message to queue",
            err:err
        })
    }
}

const create=async(req,res)=>{
    try{
        
       console.log(req.body);
        const response=await bookingService.create(req.body);
        console.log("after controller");
        return res.status(200).json({
            data:response,
            success:true,
            message:"Successfuly booked the flight",
            err:{}

        })


    }
    catch(err){
      
             return res.status(500).json({
                data:{},
                success:false,
                message:"Not able to proceed with booking",
                err:err.message
             })
    }
}
const update=async(req,res)=>{
    try{
        console.log(req.body);
        const response=await bookingService.update(req.body);
        return res.status(200).json({
            data:response,
            success:true,
            message:"Successfully updated the booking",
            err:{}



        })

    }
    catch(err){
        return res.status(500).json({
            data:{},
            success:false,
            message:"Cannot update the booking",
            err:err

        })
    }
}
const customerCreate=async(req,res)=>{
    try{
        const response=await PaymentGateway.createNewCustomer(req.body);
        return res.status(200).json({
            data:response,
            success:true,
            message:"Created the user",
            err:{}
        })

    }
    catch(err){
        return res.status(500).json({
            data:{},
            success:false,
            message:"Cannot create the user",
            err:err
        })
    }
}
const cardCreate=async(req,res)=>{
    try{
        const response=await PaymentGateway.addNewCard(req.body);
        return res.status(200).json({
            data:response,
            success:true,
            message:"Created the card and add to the customer",
            err:{}
        })

    }
    catch(err){
        return res.status(500).json({
            data:{},
            success:false,
            message:"Cannot create the card",
            err:err
        })
    }
}
const createCharges=async(req,res)=>{
    try{
        const response=await PaymentGateway.createCharges(req.body);
        return res.status(200).json({
            data:response,
            success:true,
            message:"Payment is successfully done",
            err:{}
        })

    }
    catch(err){
        return res.status(500).json({
            data:{},
            success:false,
            message:"Payment can not be made",
            err:{err}
        })
    }
}
module.exports={
    create,
    update,
    sendMessageToQueue,
    customerCreate,
    cardCreate,
    createCharges
}