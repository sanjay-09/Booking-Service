const {Flight_Service_BASE_URL}=require("../config/serverConfig");
const {BookingRepository}=require("../repository/index");
const {ServiceError}=require("../utils/error/index")
const axios=require("axios");
class BookingService{

    constructor(){
        this.bookRepository=new BookingRepository();
    }
    async create(data){
        
        try{
           
        const flightId=data.flightId;
        const getFlightRequestURL=`${Flight_Service_BASE_URL}/api/v1/flight/${flightId}`;
        //getting the flight data
        const response=await axios.get(getFlightRequestURL);
        const flightData=response.data.data;
        const price=flightData.price;
        if(data.noOfSeats>flightData.totalSeats){
            throw new ServiceError("Cannot proceed with the booking","Insufficient Seats")
        }
        const totalCost=price*data.noOfSeats;
        const bookingPayload={...data,totalCost};
        console.log(bookingPayload);
        const booking=await this.bookRepository.create(bookingPayload);


        //after booking updating the flight data
        const updateFlightRequestURL=`${Flight_Service_BASE_URL}/api/v1/flightUpdate/${flightId}`;
        const updatedTotalSeats=flightData.totalSeats-data.noOfSeats;
        console.log(updateFlightRequestURL);

        await axios.patch(updateFlightRequestURL,{
            totalSeats:updatedTotalSeats

        })
        const finalBooking=await this.bookRepository.updateStatus(booking.id,{status:"Completed"});
        
    
        return finalBooking;

        }
        catch(err){
            console.log(err);
            if(err.name=="Repository Error"||err.name==="Validation Error"){
                throw err;
            }
           
            throw new ServiceError();

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