const express = require("express");
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, athorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthenticatedUser,newOrder);

router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder);

router.route("/orders/me").get(isAuthenticatedUser,myOrders);

router.route("/admin/orders").get(isAuthenticatedUser,athorizeRoles("Admin","Creator"),getAllOrders);

router.route("/admin/order/:id").put(isAuthenticatedUser,athorizeRoles("Admin","Creator"),updateOrder)
.delete(isAuthenticatedUser,athorizeRoles("Admin"),deleteOrder);

module.exports = router;