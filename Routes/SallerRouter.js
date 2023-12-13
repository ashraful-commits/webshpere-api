const express = require("express");

const { sellerAvatar, sellerMultiAvatar } = require("../Middleware/Multer.js");
const {
  createSeller,
  getAllSeller,
  me,
  sellerLogin,
  LogoutSeller,
  updateSellerRole,
  getSingleSeller,
  updateSellerStatus,
  deleteSeller,
  updateSeller,
} = require("../Controller/SellerController.js");
const { tokenVerify } = require("./../Middleware/TokenVerify.js");
//================================================create router
const sellerRouter = express.Router();
//================================================create seller
sellerRouter.route("/").get(getAllSeller).post(sellerMultiAvatar, createSeller);
//================================================login seller
sellerRouter.route("/login").post(sellerLogin);
//================================================get loggedIn seller
sellerRouter.route("/me").get(tokenVerify, me);
//================================================ logout seller
sellerRouter.route("/logout").get(LogoutSeller);
//================================================ update single seller status or role
sellerRouter
  .route("/:id")
  .put(updateSellerRole)
  .get(getSingleSeller)
  .patch(updateSellerStatus);
//================================================ delete seller
sellerRouter.route("/:id/:sellerId").delete(deleteSeller);
//================================================ update seller
sellerRouter.route("/sellerUpdate/:id").put(sellerMultiAvatar, updateSeller);
sellerRouter.route("/salesPerson/:id").get(getSingleSeller);
//================================================export router
module.exports = sellerRouter;
