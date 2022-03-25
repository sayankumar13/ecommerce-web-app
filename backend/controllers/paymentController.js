const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.processPayment = catchAsyncErrors(async (req,res,next) =>{
    
    const myPayment = await payment.create({
        amount: req.body.amount,
        currency:"bdt",
    });
    res
    .status(200)
    .json({success: true, client_secret: myPayment.client_secret});
})

