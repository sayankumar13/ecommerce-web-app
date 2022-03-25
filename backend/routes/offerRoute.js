const express = require("express");
const { createOffer, getAllOfferProducts, getAdminOffersProducts, getAllOfferProductsDetails, getOfferProductsDetails, updateOfferProduct, deleteOffersProduct, createOfferProductReview, getOffersProductReviews, deleteOfferReviews } = require("../controllers/offerProductController");
const { isAuthenticatedUser, athorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/admin/offers/new").post(isAuthenticatedUser, athorizeRoles("Admin","Creator"),createOffer);

router.route("/offersproduct").get(getAllOfferProducts);

router.route("/offersproduct/:id").get(getAllOfferProductsDetails,getOfferProductsDetails);

router
  .route("/edit/offersproduct/:id")
  .put(isAuthenticatedUser, athorizeRoles("Admin", "Creator"), updateOfferProduct);

  router
  .route("/offersproduct/:id")
  .delete(
    isAuthenticatedUser,
    athorizeRoles("Admin", "Creator"),
    deleteOffersProduct
  );

router.route("/offers/review").put(isAuthenticatedUser, createOfferProductReview);

router.route("/offers/reviews").get(getOffersProductReviews).delete(deleteOfferReviews);

router.route("/admin/offersproduct").get(isAuthenticatedUser,athorizeRoles("Admin"), getAdminOffersProducts);


module.exports = router;
