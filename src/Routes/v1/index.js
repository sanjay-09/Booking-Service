const router=require("express").Router();
const bookingController=require("../../controllers/BookingController")



router.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"ok"
    })
})
router.post("/create",bookingController.create);
router.post("/publish",bookingController.sendMessageToQueue);
router.post("/paymentAcc",bookingController.customerCreate);
router.post("/paymentAccCard",bookingController.cardCreate);
router.post("/payment",bookingController.createCharges);

router.patch("/update",bookingController.update);

module.exports=router;

