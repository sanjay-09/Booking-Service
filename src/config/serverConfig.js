const dotenv=require("dotenv");
dotenv.config();
module.exports={
    PORT:process.env.PORT,
    Flight_Service_BASE_URL:process.env.FLIGHT_SERVICE_PATH,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
    SECRET_KEY:process.env.Secret_Key,
    AUTH_SERVICE_PATH:process.env.AUTH_SERVICE_PATH,
    REDIS_URL:process.env.REDIS_URL

}