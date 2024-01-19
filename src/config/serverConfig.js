const dotenv=require("dotenv");
dotenv.config();
module.exports={
    PORT:process.env.PORT,
    Flight_Service_BASE_URL:process.env.FLIGHT_SERVICE_PATH
}