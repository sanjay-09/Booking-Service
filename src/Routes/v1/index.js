const router=require("express").Router();
const bookingController=require("../../controllers/BookingController")


router.post("/create",bookingController.create);

router.patch("/update",bookingController.update);

module.exports=router;

