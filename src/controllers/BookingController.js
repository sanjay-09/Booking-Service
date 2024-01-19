const {BookingService}=require("../services/index");
const bookingService=new BookingService();

const create=async(req,res)=>{
    try{
        console.log("create");
        console.log(req.body);
        const response=await bookingService.create(req.body);
        return res.status(200).json({
            data:response,
            success:true,
            message:"Successfuly booked the flight",
            err:{}

        })


    }
    catch(err){
             return res.status(err.statusCode).json({
                data:{},
                success:false,
                message:err.message,
                err:err.explanation
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
    update
}