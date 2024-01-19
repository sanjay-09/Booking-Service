const {StatusCodes}=require("http-status-code");
class ValidationError extends Error{
    constructor(error){
        super();
        let explanation=[];
        error.errors.forEach((err)=>{
            explanation.push(err.message);
        })
        this.name="Validation Error",
        this.message="Not able to Validate the data sent in the request",
        this.explanation=explanation,
        this.statusCode=statusCode
    }

}
module.exports=ValidationError;