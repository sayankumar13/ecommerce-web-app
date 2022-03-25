const Offers = require("../models/offerProductModel");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeautures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

// Create Offer Product ---Authenticated
exports.createOffer = catchAsyncErrors(async (req,res,next) =>{
    let images = [];

   if(typeof req.body.images === "string"){
       images.push(req.body.images);
   }
   else{
       images = req.body.images;
   }

   const imagesLinks = [];

   for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "offers",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const offer = await Offers.create(req.body);

  res.status(201).json({
      success:true,
      offer,
  });
})

// Get All Offer Products
exports.getAllOfferProducts = catchAsyncErrors(async (req, res, next) => {

  const apiFeature = new ApiFeautures(Offers.find(), req.query)

  const offer = await apiFeature.query;

  res.status(200).json({
    success: true,
    offer,
  });
});

// Get All Offer Products ---Admin
exports.getAdminOffersProducts = catchAsyncErrors(async (req, res, next) => {

  const offer = await Offers.find();

  res.status(200).json({
    success: true,
    offer,
  });
});

// Get Offer Products Details
exports.getAllOfferProductsDetails = catchAsyncErrors(async (req, res, next) => {
  const Offer = await Offers.findById(req.params.id);

  if (!Offer) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    Offer,
  });
});

// Get Single  Offer Product
exports.getOfferProductsDetails = catchAsyncErrors(async (req, res, next) => {
  let offer = await Offers.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    offer,
  });
});

// Update Offer Product --Authintaced

exports.updateOfferProduct = catchAsyncErrors(async (req, res, next) => {
  let offer = await Offers.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHander("Product not found", 404));
  }
   
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
 
  if(images !== undefined){
     
    // Delete image from cloudinary
    for (let i = 0; i < offer.images.length; i++) {
      await cloudinary.v2.uploader.destroy(offer.images[i].public_id);
    }
       
    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i],{
        folder:"offers",
      });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    })
  }
  req.body.images = imagesLinks;
 }

 offer = await Offers.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    offer,
  });
});

// Delete Offers Product
exports.deleteOffersProduct = catchAsyncErrors(async (req, res, next) => {
  const offer = await Offers.findById(req.params.id);

  if (!offer) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting images from cloudinary
  for (let i = 0; 1 < offer.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      offer.images[i].public_id
    );
  }
  
  await offer.remove();

  res.status(200).json({
    success: true,
    message: "Product deleted succesfully",
  });
});

// Create New Review
exports.createOfferProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, offerId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    profile_img: req.user.avatar,
    rating: Number(rating),
    comment,
  };

  const Offer = await Offers.findById(offerId);

  const isReviewed = Offer.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    Offer.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    Offer.reviews.push(review);
    Offer.numOfReviews = Offer.reviews.length;
  }

  let avg = 0;

  Offer.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  Offer.ratings = avg / Offer.reviews.length;

  await Offer.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getOffersProductReviews = catchAsyncErrors(async (req, res, next) => {
  const Offer = await Offers.findById(req.query.id);

  if (!Offer) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: Offer.reviews,
  });
});

// Delete Review
exports.deleteOfferReviews = catchAsyncErrors(async (req, res, next) => {
  const Offer = await Offers.findById(req.query.offerId);

  if (!Offer) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = Offer.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Offers.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
