const {Flight_Service_BASE_URL,AUTH_SERVICE_PATH}=require("../config/serverConfig");
const {BookingRepository}=require("../repository/index");
const {ServiceError}=require("../utils/error/index")
const {createChannel,publishMessage}=require("../utils/messageQueue");
const {REMINDER_BINDING_KEY,REDIS_URL}=require("../config/serverConfig");
const {AppError}=require("../utils/error/index")
const {sequelize}=require("../models/index")
const PaymentService=require("./payment-service");

const Redis = require('ioredis');
const redis = Redis.createClient({
    host:REDIS_URL,
    port: 6379, // Default Redis port
    // Optionally, you can also specify other options such as password
  });

const axios=require("axios");
class BookingService{

    constructor(){
        this.bookRepository=new BookingRepository();
    }
    async create(data){
        try{
            const key = `flight:${data.flightId}:seat:${data.seatNumber}`;
            const seatExists = await redis.exists(key);
            console.log(seatExists);
            if(!seatExists){
                const isAvailable = await redis.setnx(key, 1);
                console.log(`Seat ${data.seatNumber} reserved successfully for Flight ${data.flightId}`);
                await redis.expire(key, 600);
            }
            else{
                return "Seat is not available";

            }

            //to check their is seat in the flight or not
            const getFlightRequestURL=`${Flight_Service_BASE_URL}/api/v1/flight/${data.flightId}`;
            const response=await axios.get(getFlightRequestURL);
            const flightData=response.data.data;
            if(data.noOfSeats>flightData.totalSeats){
                throw new ServiceError("Cannot proceed with the booking","Insufficient Seats")
            }

           
             //check if particular seat is avaiable or not
             const getSeatRequestURL=`${Flight_Service_BASE_URL}/api/v1/seat/?flightId=${data.flightId}&seatNumber=${data.seatNumber}`;
             const seatAvaiable=await axios.get(getSeatRequestURL);

             if(!seatAvaiable.data.data){
                     throw new Error("seat is reserved")
             }
            

               const price=flightData.price;
               const totalCost=price*data.noOfSeats;
               const bookingPayload={...data,totalCost};
               //booking create
               const booking=await this.bookRepository.create(bookingPayload);


               //payment 

               const paymentSuccessfull=await PaymentService.createCharges({totalCost,customer_Id:data.customer_Id});
               

               //after booking updating the flight data
                const updateFlightRequestURL=`${Flight_Service_BASE_URL}/api/v1/flightUpdate/${data.flightId}`;
                const updatedTotalSeats=flightData.totalSeats-data.noOfSeats;
                await axios.patch(updateFlightRequestURL,{
                     totalSeats:updatedTotalSeats

                 })

                 const finalBooking=await this.bookRepository.updateStatus(booking.id,{status:"Completed"});
                 const statusUpdateRequestURL=`${Flight_Service_BASE_URL}/api/v1/status`;
                 await axios.patch(statusUpdateRequestURL,{
                     flightId:data.flightId,
                     seatNumber:data.seatNumber
                 })
                
                 const UserEmail=await axios.get(`${AUTH_SERVICE_PATH}/api/v1/user/${data.userId}`);
               
             const datas={
            email:UserEmail.data.data.email,
            userId:data.userId,
            totalSeats:data.noOfSeats,
            flightId:data.flightId,
            price:data.price
        }
        this.publisher(datas)
         
            
            return true;


        }
        catch(err){
           
            throw err;
        }
    }
    async publisher(data){
        try{
            const channel=await createChannel();
        publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(data));
        }
        catch(err){
            throw err;
        }

    }
    async update(data){
        try{
            const bookingId=data.bookingId;
            const addedSeats=data.addedSeats;
           //fetching the totalSeats then noOfSeats+addedSeats =>Calculate price
            const bookingDetail=await this.bookRepository.getDetails(bookingId);
            const totalSeats=bookingDetail.noOfSeats+parseInt(addedSeats);
           
            const price=bookingDetail.totalCost/bookingDetail.noOfSeats;
            const totalCost=price*totalSeats;

            
            
           

           
            const response=await this.bookRepository.updateBooking(bookingId,{totalCost,noOfSeats:totalSeats});


            const getFlightRequest=`${Flight_Service_BASE_URL}/api/v1/flight/${bookingDetail.flightId}`;
            const flightDetails=await axios.get(getFlightRequest);
            const flightData=flightDetails.data.data;
            const flightSeats=flightData.totalSeats;
           
            const updateRequest=`${Flight_Service_BASE_URL}/api/v1/flightUpdate/${bookingDetail.flightId}`;

            await axios.patch(updateRequest,{totalSeats:flightSeats-addedSeats});
            return response;
            
            


        }
        catch(err){
            console.log(err);
            throw err;

        }
    }




}
module.exports=BookingService;