const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

const { isAuthenticatedUser, athorizeRoles } = require("../middleware/auth");

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/Password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, athorizeRoles("Admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, athorizeRoles("Admin"), getSingleUser)
  .put(isAuthenticatedUser, athorizeRoles("Admin"), updateUserRole)
  .delete(isAuthenticatedUser, athorizeRoles("Admin"), deleteUser);

module.exports = router;
