const {Booking}=require("../models/index");
const {StatusCode}=require("http-status-code");
const {ValidationError, AppError}=require("../utils/error/index")

class BookingRepository{
    async create(data){
        try{
           
            
            const booking=await Booking.create(data);
            console.log(booking);
          
            return booking;

        }
        catch(err){
            console.log(err);
            if(err.name=="SequelizeValidationError"){
                throw new ValidationError(err);
            }
            throw new AppError(
                'Repository Error',
                'Cannot Create Booking',
                'There was some issue creating the booking,please try again later',
                StatusCode.INTERNAL_SERVER_ERROR
            )

        }
    }
    async updateStatus(bookingId,data){
        try{
            const booking=await Booking.findByPk(bookingId);
            console.log(booking);
            if(data.status){
                booking.status=data.status;
            }
            await booking.save();
            return booking;



        }
        catch(err){
            throw err;
        }
    }
    async updateBooking(bookingId,data){
        try{
            await Booking.update(data,{
                where:{
                    id:bookingId
                }
            });
            return true;

        }
        catch(err){
            throw err;
        }
    }
    async getDetails(bookingId){
        try{
            const result=await Booking.findByPk(bookingId);
            return result;

        }
        catch(err){
            throw err;
        }
    }
    



}
module.exports=BookingRepository;
