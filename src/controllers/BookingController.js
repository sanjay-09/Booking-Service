const {BookingService}=require("../services/index");
const bookingService=new BookingService();
const {createChannel,publishMessage}=require("../utils/messageQueue");
const {REMINDER_BINDING_KEY}=require("../config/serverConfig")


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
        
       
        const response=await bookingService.create(req.body);
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
                message:"Not able to create the city",
                err:err
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
module.exports={
    create,
    update,
    sendMessageToQueue
}