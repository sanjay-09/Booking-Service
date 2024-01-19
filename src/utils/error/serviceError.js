const {StatusCodes}=require("http-status-code");
class ServiceError extends Error{
    constructor(message="Something went wrong",explanation="service layer error",statusCode=500){
        super();
        this.name="ServiceError";
        this.message=message;
        this.explanation=explanation;
        this.statusCode=statusCode

    }
}
module.exports=ServiceError;