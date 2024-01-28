const router=require("express").Router();
const bookingController=require("../../controllers/BookingController")



router.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"ok"
    })
})
router.post("/create",bookingController.create);
router.post("/publish",bookingController.sendMessageToQueue);

router.patch("/update",bookingController.update);

module.exports=router;

