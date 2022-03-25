const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  getAdminProducts,
  deleteReviews,
} = require("../controllers/productController");
const { isAuthenticatedUser, athorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router.route("/admin/products").get(isAuthenticatedUser,athorizeRoles("Admin"), getAdminProducts);

router.route("/product/:id").get(getProductDetails);

router
  .route("/product/new")
  .post(isAuthenticatedUser, athorizeRoles("Admin", "Creator"), createProduct);

router
  .route("/edit/product/:id")
  .put(isAuthenticatedUser, athorizeRoles("Admin", "Creator"), updateProduct);

router
  .route("/product/:id")
  .delete(
    isAuthenticatedUser,
    athorizeRoles("Admin", "Creator"),
    deleteProduct
  );

router.route("/review").put(isAuthenticatedUser, createProductReview);

router.route("/reviews").get(getProductReviews).delete(isAuthenticatedUser, deleteReviews)

module.exports = router;
